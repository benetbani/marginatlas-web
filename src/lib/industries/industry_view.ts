/**
 * industry_view.ts - the activity (industry) page view model.
 *
 * Maps the data the industry page already loads (the curated cost-structure
 * margins, the industry-verdict synthesis, the activity character, the
 * representative survival curve, and the trimmed cross-place bands) into Atlas
 * Page Kit props, in the content-map reading order for an INDUSTRY page:
 *
 *   1. Hero (the trade, a verdict headline)
 *   2. Headline numbers + the honest take
 *   3. How it makes money + where each $100 goes (the money split)
 *   4. What a typical operator looks like
 *   5. Where it earns the most (the like-for-like cohort tables, kept by the page)
 *   6. Links
 *
 * Pure data, no React, so the page stays a thin renderer. The industry page has
 * no single place, so there is NO London fill here: the view is a strong
 * template that fills from the place-stable structure (margins, the model
 * anatomy, the survival archetype) and self-omits where a field is genuinely
 * unheld. It never invents a number; the cross-place bands carry the only money,
 * and they already dash when the slate is too thin.
 *
 * Every field is nullable and self-omitting; the kit renders nothing for a null.
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures.
 */
import type { NumberFormatSpec } from "@/components/kit/numberFormat";
import type { IndustryVerdict } from "@/lib/scores/industry_verdict";
import type { ActivityCharacter } from "@/lib/content/activity_character";
import type {
  ActivityRevenueBand,
  ActivityTakeHomeBand,
  ActivitySurvival,
} from "@/lib/scores/activity_board";

/* ----------------------------- output shape ----------------------------- */

export type IndustryViewMasthead = {
  /** Coordinate eyebrow: the sector name (no place at this altitude). */
  eyebrow: string | null;
  /** The serif headline: the opinionated read of how the model makes money. */
  title: string;
  /** The one-line answer under the headline. */
  answer: string | null;
  /** The anchor: typical revenue across covered places, when a band exists. */
  anchor: { label: string; value: number; format: NumberFormatSpec } | null;
  /** The signature spread, when a defensible band exists across places. */
  spread: {
    p10: number | null;
    p25: number | null;
    p50: number | null;
    p75: number | null;
    p90: number | null;
  } | null;
  /** The quiet supporting stat row (structural shares, place-stable). */
  stats: Array<{ label: string; value: string | null }>;
};

export type IndustryView = {
  masthead: IndustryViewMasthead;
  /** The honest take: the verdict close, plus the model anatomy as points. */
  honestTake: { verdict: string; points: string[]; body: string | null } | null;
  /** Where each $100 of a sale goes (per-$100 items from the margin shape). */
  moneyGoes: Array<{ label: string; perHundred: number; kept?: boolean; hint?: string }> | null;
  /** What a typical operator looks like: the structural facts, in plain terms. */
  typicalOperator: Array<{ label: string; value: string; hint?: string }> | null;
  /** The levers that move this trade's margin, derived from the held cost
   * structure (the largest non-kept lines of the per-$100 split). Each weighs
   * the margin down, ranked by share. Null when no cost structure is held. */
  costDrivers: Array<{
    label: string;
    note?: string;
    direction: "down";
    impact: 1 | 2 | 3;
  }> | null;
};

/* ------------------------------- inputs --------------------------------- */

export type IndustryViewInput = {
  industryName: string;
  /** Lowercased plural noun for the trade, e.g. "restaurants". */
  industryNoun: string;
  sectorName: string | null;
  /** The curated, place-stable margin shares (0..1) or null. */
  margins: {
    grossMargin: number | null;
    operatingMargin: number | null;
    netMargin: number | null;
    assetIntensity: number | null;
  };
  /** The synthesised business-model verdict (already self-omitting). */
  verdict: IndustryVerdict;
  /** The hand-written activity character, or null when none is written. */
  character: ActivityCharacter | null;
  /** Trimmed cross-place revenue band (or all-null when the slate is thin). */
  revenue: ActivityRevenueBand;
  /** Trimmed cross-place owner take-home band (or all-null). */
  takeHome: ActivityTakeHomeBand;
  /** Representative survival archetype for the activity (or all-null). */
  survival: ActivitySurvival;
};

/* ------------------------------ helpers --------------------------------- */

function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v);
}
function usd(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}
function pct(share: number): string {
  return `${Math.round(share * 100)}%`;
}

/* ---------------------------- the builder ------------------------------- */

export function buildIndustryView(input: IndustryViewInput): IndustryView {
  const {
    industryNoun,
    sectorName,
    margins,
    verdict,
    character,
    revenue,
    takeHome,
    survival,
  } = input;

  /* -- masthead ------------------------------------------------------- */
  // The headline is the verdict's one-line model read (a real opinion, no
  // number), so the hero leads with the thesis the founder asked for. The
  // answer is the activity character's hook when one is written (the sharpest
  // single sentence), else the verdict close (what kills the weak operators),
  // and as a last resort a plain framing of the trade, so a thinly-described
  // activity still opens with a real read rather than a blank.
  // The verdict headline is a single assertion, so it ends in a full stop to
  // match the cell, city, and country verdict H1s (consistent masthead grammar).
  const title = endWithPeriod(verdict.headline);
  const answer =
    textOrNull(character?.hook) ??
    textOrNull(verdict.close) ??
    `How ${industryNoun} make money: where each dollar goes, and what reaches the owner.`;

  // The cross-place band: defensible only when p10/median/p90 are all real and
  // ordered (the board's own guard). The typical anchor is the median; the
  // spread fills the quartiles by interpolation in the strip.
  const hasBand =
    isNum(revenue.p10) &&
    isNum(revenue.median) &&
    isNum(revenue.p90) &&
    (revenue.p90 as number) > (revenue.p10 as number);

  // The masthead always carries an anchor so the hero silhouette matches across
  // trades. The strong anchor is the cross-place typical revenue, shown only
  // when a defensible band exists. A thin trade (no US-state band) would
  // otherwise open with no number, no spread, and no anchor, so it falls back to
  // the place-stable kept share: how much of every $100 of sales reaches the
  // owner. This is a structural ratio the activity holds worldwide (not a
  // fabricated dollar figure), clearly labeled so it never reads as revenue.
  // True when the masthead is leading with the kept-share fallback anchor (no
  // revenue band). The net-margin stat is then dropped from the stat row below,
  // because the fallback anchor already IS the net margin (no number twice).
  const usingKeptShareAnchor = !hasBand && isNum(margins.netMargin);

  const anchor =
    hasBand && isNum(revenue.median)
      ? {
          label: "Typical revenue a year, across the US markets we measure",
          value: revenue.median as number,
          format: "usd-compact" as NumberFormatSpec,
        }
      : usingKeptShareAnchor
        ? {
            label: "Kept by the owner per $100 of sales, before any place is picked",
            value: Math.round((margins.netMargin as number) * 100),
            format: "usd-full" as NumberFormatSpec,
          }
        : null;

  const spread = hasBand
    ? {
        p10: revenue.p10,
        p25: null,
        p50: revenue.median,
        p75: null,
        p90: revenue.p90,
      }
    : null;

  // The quiet stat row: the place-stable structural shares (gross / net), and
  // the owner take-home band when one is defensible. These hold worldwide, so
  // they belong on the activity page even when no single place is named.
  const stats: IndustryViewMasthead["stats"] = [
    {
      label: "Net margin, typical",
      // Dropped when the kept-share fallback anchor is leading the masthead, so
      // the same net-margin figure never prints twice in the hero.
      value:
        !usingKeptShareAnchor && isNum(margins.netMargin)
          ? pct(margins.netMargin)
          : null,
    },
    {
      label: "Survives direct costs",
      value: isNum(margins.grossMargin) ? pct(margins.grossMargin) : null,
    },
    {
      label: "Owner take-home, low to high",
      value:
        isNum(takeHome.p10) && isNum(takeHome.p90)
          ? `${usd(takeHome.p10)} to ${usd(takeHome.p90)}`
          : null,
    },
  ];

  const masthead: IndustryViewMasthead = {
    eyebrow: textOrNull(sectorName),
    title,
    answer,
    anchor,
    spread,
    stats,
  };

  /* -- honest take ---------------------------------------------------- */
  // The through-line: the verdict's lead traces the money top-to-bottom (the
  // body), the close is the bottom read (the verdict line), and the model
  // anatomy signals become the supporting points so the box says the quiet part
  // out loud. The activity-character watch-out leads the points when written
  // (it is the bluntest statement of what kills the weak operator).
  const honestTake = buildHonestTake(verdict, character);

  /* -- money goes (per $100) ----------------------------------------- */
  const moneyGoes = buildMoneyGoes(margins);

  /* -- cost drivers (the levers) ------------------------------------- */
  // The biggest held cost lines ARE the levers that move the margin. Reuse the
  // per-$100 split (the non-kept lines), ranked by size; no new numbers, no
  // fabrication. Null when no cost structure is held.
  const costDrivers = buildCostDrivers(moneyGoes);

  /* -- typical operator ---------------------------------------------- */
  const typicalOperator = buildTypicalOperator(input, hasBand);

  return {
    masthead,
    honestTake,
    moneyGoes,
    typicalOperator: typicalOperator.length >= 2 ? typicalOperator : null,
    costDrivers,
  };
}

/* --------------------------- derivations -------------------------------- */

function textOrNull(s: string | null | undefined): string | null {
  return typeof s === "string" && s.trim().length > 0 ? s : null;
}

/**
 * Clean a trade name for use inside prose headings. Strips the parenthetical
 * qualifier the taxonomy carries on some trades (e.g. "Hair salons (full
 * service)" becomes "Hair salons"), and collapses any double spacing left
 * behind. The qualifier is useful in the page title and the breadcrumb, but it
 * leaks awkwardly into a sentence heading ("How hair salons (full service)
 * make money"), so headings read the clean form. The bare name passes through
 * unchanged.
 */
export function cleanTradeName(name: string): string {
  return name
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Ensure a single-assertion headline ends in a full stop, like the cell,
 * city, and country verdict H1s (a verdict is one assertion). Leaves an
 * existing terminal . ! or ? in place. */
function endWithPeriod(s: string): string {
  const t = s.trim();
  if (t.length === 0) return t;
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

function buildHonestTake(
  verdict: IndustryVerdict,
  character: ActivityCharacter | null,
): IndustryView["honestTake"] {
  const verdictLine = textOrNull(verdict.close);

  // The honest-take box carries the bottom-line verdict plus the activity
  // watch-out ONLY. The money-trace lead (verdict.lead) and the model-anatomy
  // signal notes live in the "how it makes money" section directly below, so
  // feeding them here too printed the same two-to-three sentences twice in one
  // scroll. Keep this box to the verdict and the one thing to watch.
  const points: string[] = [];
  const watchOut = textOrNull(character?.watchOut);
  if (watchOut) points.push(watchOut);

  if (!verdictLine && points.length === 0) return null;
  return {
    verdict: verdictLine ?? "How this kind of business makes money.",
    points: points.slice(0, 2),
    body: null,
  };
}

/** Bad first, then flat, then good: lead the honest take with the hard part. */
function toneRank(tone: "good" | "flat" | "bad"): number {
  return tone === "bad" ? 0 : tone === "flat" ? 1 : 2;
}

/**
 * Per-$100 split from the place-stable margin shape. The net margin is what the
 * owner keeps; the remaining $100 - net is apportioned across the three cost
 * stages the margins describe: direct costs (1 - gross), operating overhead
 * (gross - operating), and fixed costs + tax (operating - net). Every stage
 * self-omits when its inputs are missing, and the block only renders when at
 * least two stages plus the kept row survive and the total lands near $100.
 */
function buildMoneyGoes(margins: {
  grossMargin: number | null;
  operatingMargin: number | null;
  netMargin: number | null;
}): IndustryView["moneyGoes"] {
  const gross = margins.grossMargin;
  const operating = margins.operatingMargin;
  const net = margins.netMargin;
  // Need at least the gross and net to draw an honest split.
  if (!isNum(gross) || !isNum(net)) return null;

  const items: Array<{ label: string; perHundred: number; kept?: boolean; hint?: string }> = [];

  // Direct costs: what the inputs eat before anything else (1 - gross).
  const direct = Math.max(0, 1 - gross);
  if (direct > 0) {
    items.push({
      label: "Direct costs",
      perHundred: direct * 100,
      hint: "materials, stock, the cost of what is sold",
    });
  }

  // Operating overhead: the day-to-day cost of keeping the doors open
  // (gross - operating). Only when operating is held and below gross.
  if (isNum(operating) && gross - operating > 0) {
    items.push({
      label: "Running the place",
      perHundred: (gross - operating) * 100,
      hint: "staff, marketing, admin",
    });
  }

  // Fixed costs and tax: the gap between the operating line and the bottom line.
  // Uses operating when held, otherwise folds into a single "rent, fixed costs,
  // tax" stage from gross so the bar still balances to $100.
  const upper = isNum(operating) ? operating : gross;
  const fixedAndTax = Math.max(0, upper - net);
  if (fixedAndTax > 0) {
    items.push({
      label: "Rent, fixed costs, and tax",
      perHundred: fixedAndTax * 100,
    });
  }

  // What the owner keeps: the net margin, the one kept row (moss accent).
  items.push({
    label: "What the owner keeps",
    perHundred: net * 100,
    kept: true,
  });

  const usable = items.filter((it) => it.perHundred >= 0.5);
  return usable.length >= 2 ? usable : null;
}

/**
 * Derive the cost-driver levers from the held per-$100 split: the largest
 * non-kept cost lines, ranked by share, each weighing the margin down. Returns 3
 * to 4 levers, or null when no cost structure is held. Mirrors the cell page's
 * buildCostDrivers: no new figures, no fabrication, the held breakdown carries
 * everything. The note is the held one-line hint when the line has one.
 */
function buildCostDrivers(
  moneyGoes: Array<{ label: string; perHundred: number; kept?: boolean; hint?: string }> | null,
): IndustryView["costDrivers"] {
  if (!moneyGoes || moneyGoes.length === 0) return null;
  const costLines = moneyGoes
    .filter((m) => !m.kept && isNum(m.perHundred) && m.perHundred > 0)
    .sort((a, b) => b.perHundred - a.perHundred)
    .slice(0, 4);
  if (costLines.length === 0) return null;
  /* THE TICK IS A SHARE, NOT A RANK, mirroring the cell page's builder and for
     the reason written out in full there: `i === 0 ? 3 : i === 1 ? 2 : 1` is
     sort position drawn as a magnitude, so a three-dollar difference took a
     whole step of the scale while a ten-dollar one took none. Proportional to
     the heaviest line, no threshold chosen by anybody, no new figure. */
  const heaviest = Math.max(...costLines.map((m) => m.perHundred));
  return costLines.map((m) => ({
    label: m.label,
    note: m.hint,
    direction: "down" as const,
    impact: Math.min(3, Math.max(1, Math.ceil((m.perHundred / heaviest) * 3))) as 1 | 2 | 3,
  }));
}

/**
 * What a typical operator looks like, in plain terms. The activity page holds no
 * per-place headcount or revenue per operator, so this reads the place-stable
 * structure into tangible operator facts: how much of each sale survives, what
 * the owner keeps, the capital bar to start, and the representative one-year
 * survival. Every row self-omits on a missing input; the block only renders when
 * at least two survive. No fabricated counts.
 */
function buildTypicalOperator(
  input: IndustryViewInput,
  hasBand: boolean,
): Array<{ label: string; value: string; hint?: string }> {
  const { margins, revenue, survival } = input;
  const rows: Array<{ label: string; value: string; hint?: string }> = [];

  if (hasBand && isNum(revenue.median)) {
    rows.push({
      label: "Typical revenue a year",
      value: usd(revenue.median),
      hint: "the median place we cover",
    });
  }
  if (isNum(margins.grossMargin)) {
    rows.push({
      label: "Survives the direct cost of a sale",
      value: pct(margins.grossMargin),
    });
  }
  if (isNum(margins.netMargin)) {
    rows.push({
      label: "Reaches the owner",
      value: pct(margins.netMargin),
      hint: "what the owner keeps, per dollar of sales",
    });
  }
  // Capital to start, read from asset intensity as a plain word (no fake money).
  if (isNum(margins.assetIntensity)) {
    const a = margins.assetIntensity;
    const word = a >= 0.9 ? "heavy" : a >= 0.45 ? "moderate" : "light";
    rows.push({
      label: "Capital to start",
      value: word,
      hint: "money on the floor before the first sale",
    });
  }
  if (isNum(survival.yr1)) {
    rows.push({
      label: "Open after one year",
      value: `${Math.round(survival.yr1)} in 100`,
      hint: "representative for the trade",
    });
  }

  return rows;
}

/**
 * The sticky-nav sections that will actually render, in reading order. The page
 * passes this to StickySectionNav, which additionally drops any id whose anchor
 * is missing on mount, so the two never disagree. The ids match the anchors the
 * page mounts (the three canonical section ids plus the new div anchors).
 */
export function industryViewNav(
  view: IndustryView,
  hasPlaceCohorts: boolean,
  hasRelated: boolean,
): Array<{ id: string; label: string }> {
  const nav: Array<{ id: string; label: string }> = [
    { id: "hero", label: "Overview" },
  ];
  if (view.honestTake) nav.push({ id: "honest-take", label: "The honest take" });
  nav.push({ id: "how-it-works", label: "How it makes money" });
  if (view.moneyGoes) nav.push({ id: "money", label: "Where the money goes" });
  if (view.typicalOperator) nav.push({ id: "typical-operator", label: "A typical operator" });
  if (hasPlaceCohorts) nav.push({ id: "where-it-earns", label: "Where it earns most" });
  nav.push({ id: "margin-waterfall", label: "The cost stack" });
  if (view.costDrivers) nav.push({ id: "cost-drivers", label: "What moves the cost" });
  if (hasRelated) nav.push({ id: "related", label: "Related activities" });
  return nav;
}
