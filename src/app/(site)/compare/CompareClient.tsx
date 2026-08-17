"use client";

import {
  useState,
  useMemo,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ComboField, type ComboOption } from "@/components/ComboField";
import { COUNTRIES, INDUSTRIES, INDUSTRY_BY_ID } from "@/lib/taxonomy";
import { getRegionsForCountry } from "@/lib/regions/regions-by-country";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import {
  fmtUSD,
  fmtPct,
  fmtInt,
  fmtNum,
  MISSING,
} from "@/components/board/format";
import { isGatingEnabled } from "@/lib/feature_flags";
import { GatedTakeHome } from "@/components/monetization/GatedTakeHome";
import { RedactedNumber } from "@/components/monetization/RedactedNumber";
import {
  HonestTakeBox,
  RangeStrip,
  SectionEmpty,
  StickySectionNav,
  Slider,
} from "@/components/kit";
import { useUrlStateMap } from "@/lib/url_state";
import {
  generateCompareVerdict,
  type CompareSide,
} from "@/lib/scores/compare_verdict";

type Slot = { country: string; industry: string; region: string };

/**
 * The per-city payload the /compare grid consumes. Mirrors the CompactCell the
 * /api/cell-lookup route returns: the decisive A/B/C/H/I/J figures of the
 * cell-page board, already derived server-side so the client only formats them.
 */
export type CompactCell = {
  country: string;
  region: string | null;
  industry: string;
  year: number | null;
  revenue_per_firm: number | null;
  rev_p10: number | null;
  rev_p25: number | null;
  rev_p50: number | null;
  rev_p75: number | null;
  rev_p90: number | null;
  net_margin: number | null;
  owner_take_home: number | null;
  n_enterprises: number | null;
  density_per_10k: number | null;
  n_employees: number | null;
  payroll_per_employee: number | null;
  pricing_power: string | null;
  rent_pressure: string | null;
  rent_share_pct: number | null;
  labor_pressure: string | null;
  payroll_share_pct: number | null;
  survival_yr1: number | null;
  survival_yr3: number | null;
  survival_yr5: number | null;
  quality_score: number | null;
  cellUrl: string | null;
};

/** Up to three cities, side by side. */
const SLOT_COUNT = 3;

/**
 * The matchup the page lands on. The activity is set here (not filled in a mount
 * effect) so the server render and the client's first render are identical: the
 * same three slots, the same default industry. compare/page.tsx fetches the
 * cells for exactly these slots server-side and hands them in as initialCells,
 * so the first paint (and a no-JS / crawler view) shows real rows.
 */
const DEFAULT_SLOTS: Slot[] = [
  { country: "US", industry: "restaurants", region: "california" },
  { country: "US", industry: "restaurants", region: "texas" },
  { country: "US", industry: "restaurants", region: "new-york" },
];

/** A stable key for a slot's data identity, used to decide whether a seeded
 * cell still matches the slot (so we skip the redundant first-paint refetch). */
function slotKey(s: Slot): string {
  return `${s.country}|${s.industry}|${s.region}`;
}

/** A finite, real number. */
function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v);
}

/**
 * One metric row of the comparison grid. `value` resolves a city's cell to a
 * pre-formatted display string (route numbers through ./board/format), so the
 * grid reads in exactly the board's language. `numeric` resolves the same row
 * to a raw comparable number (or null) for the per-row strongest-value mark
 * and the biggest-difference read; rows that are qualitative (pricing power,
 * rent pressure) leave it undefined and are never compared as numbers.
 */
type MetricRow = {
  label: string;
  hint?: string;
  value: (c: CompactCell) => string;
  numeric?: (c: CompactCell) => number | null;
  /** For numeric rows, whether a higher value is the "stronger" one. */
  higherIsStronger?: boolean;
  /** Whether this row is eligible for the biggest-difference callout. */
  differ?: boolean;
  /** Optional render escape: a node shown INSTEAD of `value` (used for the
   * paywalled owner take-home, so the real figure is never in the grid HTML for
   * a free viewer). When set, the cell renders this instead of the string. */
  node?: (c: CompactCell) => ReactNode;
};

type MetricGroup = { key: string; title: string; rows: MetricRow[] };

const pctWhole = (v: number | null): string =>
  isNum(v) ? `${Math.round(v)}%` : MISSING;

/**
 * The owner-take-home cell under the paywall (Milestone 2). Renders the redacted
 * placeholder plus the authed per-cell reveal, resolved from the compared cell's
 * URL, so the real figure is never in the grid for a free viewer. Only mounted
 * when gating is on (the API also redacts the value to null in that case).
 */
function CompareTakeHome({ cellUrl }: { cellUrl: string | null }) {
  const parts = (cellUrl ?? "").split("/").filter(Boolean);
  if (parts.length >= 3) {
    const [country, geo, industry] = parts;
    return (
      <GatedTakeHome
        country={country}
        geo={geo}
        industry={industry}
        tier="basic"
        ariaLabel="Owner take-home, unlock with Basic"
      />
    );
  }
  return (
    <RedactedNumber
      tier="basic"
      entry="cell_owner_take_home"
      ariaLabel="Owner take-home, unlock with Basic"
    />
  );
}

// The decisive rows, grouped to match the cell-page board sections A,B,C,H,I,J.
// Labels and fmt helpers are the board's, so the comparison speaks the same
// language as every cell page.
const GROUPS: MetricGroup[] = [
  {
    key: "numbers",
    title: "The numbers",
    rows: [
      {
        label: "Typical revenue",
        hint: "median firm",
        value: (c) => fmtUSD(c.revenue_per_firm),
        numeric: (c) => c.revenue_per_firm,
        higherIsStronger: true,
        differ: true,
      },
      {
        label: "Net margin",
        value: (c) => fmtPct(c.net_margin, { fromFraction: true }),
        numeric: (c) => c.net_margin,
        higherIsStronger: true,
        differ: true,
      },
      {
        label: "Owner take-home",
        value: (c) => fmtUSD(c.owner_take_home),
        numeric: (c) => c.owner_take_home,
        higherIsStronger: true,
        differ: true,
        node: isGatingEnabled()
          ? (c) => <CompareTakeHome cellUrl={c.cellUrl} />
          : undefined,
      },
    ],
  },
  {
    key: "market",
    title: "The market",
    rows: [
      {
        label: "Competitors",
        hint: "firms in this market",
        value: (c) => fmtInt(c.n_enterprises),
        numeric: (c) => c.n_enterprises,
      },
      {
        label: "Density",
        hint: "per 10k residents",
        value: (c) =>
          isNum(c.density_per_10k) ? fmtNum(c.density_per_10k) : MISSING,
        numeric: (c) => c.density_per_10k,
        differ: true,
      },
    ],
  },
  {
    key: "pricing",
    title: "Pricing power",
    rows: [
      {
        label: "Pricing power",
        value: (c) => c.pricing_power ?? MISSING,
      },
    ],
  },
  {
    key: "location",
    title: "Location and rent",
    rows: [
      {
        label: "Rent share of revenue",
        value: (c) => pctWhole(c.rent_share_pct),
        numeric: (c) => c.rent_share_pct,
        higherIsStronger: false,
        differ: true,
      },
      {
        label: "Rent pressure",
        value: (c) => c.rent_pressure ?? MISSING,
      },
    ],
  },
  {
    key: "labor",
    title: "Labor and skills",
    rows: [
      {
        label: "Payroll share of revenue",
        value: (c) => pctWhole(c.payroll_share_pct),
        numeric: (c) => c.payroll_share_pct,
        higherIsStronger: false,
        differ: true,
      },
      {
        label: "Wage per employee",
        value: (c) => fmtUSD(c.payroll_per_employee),
        numeric: (c) => c.payroll_per_employee,
        higherIsStronger: true,
        differ: true,
      },
      {
        label: "Labor pressure",
        value: (c) => c.labor_pressure ?? MISSING,
      },
    ],
  },
  {
    key: "survival",
    title: "Survival and fragility",
    rows: [
      {
        label: "1-year survival",
        value: (c) => (isNum(c.survival_yr1) ? `${c.survival_yr1}%` : MISSING),
        numeric: (c) => c.survival_yr1,
        higherIsStronger: true,
      },
      {
        label: "3-year",
        value: (c) => (isNum(c.survival_yr3) ? `${c.survival_yr3}%` : MISSING),
        numeric: (c) => c.survival_yr3,
        higherIsStronger: true,
      },
      {
        label: "5-year",
        value: (c) => (isNum(c.survival_yr5) ? `${c.survival_yr5}%` : MISSING),
        numeric: (c) => c.survival_yr5,
        higherIsStronger: true,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Weighting + the personalized verdict
//
// The "where each wins" read above is the balanced, house verdict. Below it a
// reader can say what THEY care about: drag a weight per metric, lock the ones
// that matter so a reset leaves them, and the page re-ranks live (P1, no Apply)
// to a one-line "for what you care about, X wins". Every weight lives in the
// URL (P3), so a weighted comparison is a link you can send.
//
// The score is honest by construction. Each metric is read off the SAME compact
// cells the grid uses (no invented numbers), normalized 0..1 across the active
// columns by min-max so a weight means the same thing on a percentage as on a
// dollar figure, then summed by weight. Cost-share metrics invert (lower rent
// or payroll share is the stronger column). When the columns span countries the
// money metrics are dropped from the score, not just caveated: a raw-USD "win"
// across price regimes is the exact cross-country money-rank the page forbids.
// ---------------------------------------------------------------------------

/** One thing a reader can weight, read straight off the compact cell. */
type WeightMetric = {
  /** Stable key: the URL param is `w<key>`, the lock token is `<key>`. */
  key: WeightMetricKey;
  /** Quiet label for the slider and the verdict copy. */
  label: string;
  /** The comparable number for a column, or null when the cell lacks it. */
  numeric: (c: CompactCell) => number | null;
  /** Higher is the stronger column (false for cost-share metrics). */
  higherIsStronger: boolean;
  /** Whether this metric is a raw-money figure, dropped across countries. */
  money: boolean;
};

// The curated set, drawn from the rows the grid already shows so the weighting
// speaks the grid's language: what an owner keeps, the margin, how survivable
// the first year is, how hard rent and labor press, and what it pays staff.
const WEIGHT_METRICS: WeightMetric[] = [
  {
    key: "take",
    label: "Take-home",
    numeric: (c) => c.owner_take_home,
    higherIsStronger: true,
    money: true,
  },
  {
    key: "margin",
    label: "Margin",
    numeric: (c) => c.net_margin,
    higherIsStronger: true,
    money: false,
  },
  {
    key: "breakin",
    label: "Break-in ease",
    numeric: (c) => c.survival_yr1,
    higherIsStronger: true,
    money: false,
  },
  {
    key: "rent",
    label: "Rent pressure",
    numeric: (c) => c.rent_share_pct,
    higherIsStronger: false,
    money: false,
  },
  {
    key: "pay",
    label: "Pays staff",
    numeric: (c) => c.payroll_per_employee,
    higherIsStronger: true,
    money: true,
  },
];

/** The starting weight every metric carries (a flat, equal voice). */
const DEFAULT_WEIGHT = 50;
const WEIGHT_MIN = 0;
const WEIGHT_MAX = 100;

/** The metric keys, as a literal union, so the weight field keys below stay
 *  distinct from the `wlock` field (no `w${string}` collision). */
type WeightMetricKey = "take" | "margin" | "breakin" | "rent" | "pay";

/** The URL-state field key for a metric weight (`wtake`, `wmargin`, ...). */
type WeightFieldKey = `w${WeightMetricKey}`;

/** The shape of the weighting state held in the URL: one integer per metric
 *  weight, plus the pinned-metric token list. */
type WeightState = Record<WeightFieldKey, number> & { wlock: string[] };

/** Parse + clamp one weight off the URL, falling back to the flat default. */
function parseWeight(raw: string | null): number {
  if (raw == null) return DEFAULT_WEIGHT;
  const n = Math.round(Number(raw));
  if (!Number.isFinite(n)) return DEFAULT_WEIGHT;
  return Math.min(WEIGHT_MAX, Math.max(WEIGHT_MIN, n));
}

/**
 * The useUrlStateMap field config for the weighting state. Module-constant, so
 * the hook treats it as stable. A weight at its default serializes to null (the
 * key drops from a shared link, keeping it to only what the reader changed); the
 * lock set serializes to a stable dot-joined token list, empty dropping the key.
 */
type WeightFieldConfig = {
  [K in keyof WeightState]: import("@/lib/url_state").UrlStateField<WeightState[K]>;
};

const WEIGHT_FIELDS: WeightFieldConfig = (() => {
  const fields: Record<string, unknown> = {
    wlock: {
      parse: (raw: string | null): string[] =>
        raw == null || raw === ""
          ? []
          : raw
              .split(".")
              .filter((k) => WEIGHT_METRICS.some((m) => m.key === k)),
      serialize: (v: string[]): string | null =>
        v.length === 0 ? null : [...v].sort().join("."),
      fallback: [] as string[],
    },
  };
  for (const m of WEIGHT_METRICS) {
    fields[`w${m.key}`] = {
      parse: parseWeight,
      serialize: (v: number): string | null =>
        v === DEFAULT_WEIGHT ? null : String(v),
      fallback: DEFAULT_WEIGHT,
    };
  }
  return fields as WeightFieldConfig;
})();

/** A column's weighted standing, plus which single metric carried it most. */
type WeightedStanding = {
  index: number;
  /** Weighted total in 0..1 (sum of weight-share times metric score). */
  total: number;
  /** The metric that contributed the most to this column's lead, or null. */
  topMetricLabel: string | null;
};

/**
 * Score the active columns by the reader's weights. Pure: no state, no fetch.
 *
 * For each in-scope metric (money metrics dropped when `dropMoney`), the columns
 * that carry the figure are min-max normalized to 0..1 (the strongest column is
 * 1, the weakest 0; cost-share metrics invert first so lower lands at 1). Each
 * column's contribution is its normalized score times that metric's share of the
 * total weight. Columns missing a metric simply do not score on it. Returns the
 * standings sorted strongest first, plus whether the lead is decisive.
 */
function scoreByWeights(
  activeCols: number[],
  cells: Record<number, CompactCell | null>,
  weights: Record<string, number>,
  dropMoney: boolean,
): {
  standings: WeightedStanding[];
  decisive: boolean;
  anyWeight: boolean;
  anyWeightAtAll: boolean;
} {
  const metrics = WEIGHT_METRICS.filter((m) => !(dropMoney && m.money));
  const totalWeight = metrics.reduce(
    (s, m) => s + Math.max(0, weights[m.key] ?? 0),
    0,
  );
  // Whether the reader has weighted anything at all, including the money metrics
  // dropped across countries. Lets the verdict say "all on figures we leave out"
  // rather than "every weight is at zero" when only money metrics carry weight.
  const totalWeightAllMetrics = WEIGHT_METRICS.reduce(
    (s, m) => s + Math.max(0, weights[m.key] ?? 0),
    0,
  );

  // Running totals + per-column best single metric contribution.
  const totals: Record<number, number> = {};
  const topContrib: Record<number, { label: string; amount: number }> = {};
  activeCols.forEach((i) => {
    totals[i] = 0;
  });

  if (totalWeight > 0) {
    for (const m of metrics) {
      const w = Math.max(0, weights[m.key] ?? 0);
      if (w === 0) continue;
      const share = w / totalWeight;
      const present = activeCols
        .map((i) => ({ i, v: m.numeric(cells[i] as CompactCell) }))
        .filter((r): r is { i: number; v: number } => isNum(r.v));
      if (present.length < 2) continue; // nothing to rank on this metric
      const vals = present.map((r) => r.v);
      const lo = Math.min(...vals);
      const hi = Math.max(...vals);
      const span = hi - lo;
      for (const { i, v } of present) {
        // 0..1 with the stronger column at 1; flat metric scores every column 1.
        const raw01 = span === 0 ? 1 : (v - lo) / span;
        const score01 = m.higherIsStronger ? raw01 : 1 - raw01;
        const contribution = score01 * share;
        totals[i] += contribution;
        const cur = topContrib[i];
        if (!cur || contribution > cur.amount) {
          topContrib[i] = { label: m.label, amount: contribution };
        }
      }
    }
  }

  const standings: WeightedStanding[] = activeCols
    .map((i) => ({
      index: i,
      total: totals[i] ?? 0,
      topMetricLabel: topContrib[i]?.label ?? null,
    }))
    .sort((a, b) => b.total - a.total);

  // A lead is decisive only when the leader is meaningfully clear of the next
  // column, so we never crown a near-tie as a confident personal pick.
  const decisive =
    standings.length >= 2 &&
    standings[0].total - standings[1].total >= 0.04 &&
    standings[0].total > 0;

  return {
    standings,
    decisive,
    anyWeight: totalWeight > 0,
    anyWeightAtAll: totalWeightAllMetrics > 0,
  };
}

/**
 * @param initialSlots  The matchup to render first (defaults to DEFAULT_SLOTS).
 * @param initialCells  The cells already resolved server-side for those slots.
 *   Seeding both means the client's first render equals the server render (no
 *   hydration mismatch), then the effects below hydrate ?q= and keep the grid
 *   live as the user edits.
 */
export function CompareClient({
  initialSlots = DEFAULT_SLOTS,
  initialCells = {},
}: {
  initialSlots?: Slot[];
  initialCells?: Record<number, CompactCell | null>;
} = {}) {
  const [slots, setSlots] = useState<Slot[]>(initialSlots);
  const [cells, setCells] =
    useState<Record<number, CompactCell | null>>(initialCells);
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  // The slot matchup (?q=) and the reader's weights (?w*) both write the URL.
  // They go through the SAME Next router store so neither clobbers the other:
  // the weight hook (useUrlStateMap) reads useSearchParams to merge, and the
  // slot writer below merges over that same searchParams instead of a raw
  // history.replaceState the router would not see.
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // The data identity of each slot as it was first rendered. A slot whose
  // current key still matches its seed already carries the server-fetched cell,
  // so the first-paint fetch skips it (no redundant request, no flicker). Once
  // the user edits a slot its key changes and the fetch runs normally. A ref, so
  // reading it never triggers a render and it is fixed at mount.
  const seededKeys = useRef<Record<number, string | undefined>>(
    Object.fromEntries(
      initialSlots.map((s, i) => [i, initialCells[i] != null ? slotKey(s) : undefined]),
    ),
  );

  const countryOptions: ComboOption[] = useMemo(
    () =>
      COUNTRIES.map((c) => ({
        value: c.code,
        label: c.name,
        keywords: [c.code.toLowerCase(), c.name.toLowerCase()],
      })),
    [],
  );

  const industryOptions: ComboOption[] = useMemo(
    () =>
      INDUSTRIES.map((i) => ({
        value: i.id,
        label: i.name,
        examples: i.examples,
        keywords: i.keywords,
      })),
    [],
  );

  // Fetch the cell for each slot whenever country/industry/region changes. The
  // data source is unchanged: the same /api/cell-lookup route, now returning
  // the enriched board payload.
  useEffect(() => {
    slots.forEach((slot, idx) => {
      if (!slot.country || !slot.industry) {
        setCells((c) => ({ ...c, [idx]: null }));
        return;
      }
      // Skip the slots whose cell was already resolved server-side and has not
      // changed since: refetching them would only re-request the same figures
      // and flicker the first paint. The guard clears itself once consumed, so
      // a later edit back to the seeded value still fetches normally.
      if (seededKeys.current[idx] === slotKey(slot)) {
        seededKeys.current[idx] = undefined;
        return;
      }
      setLoading((l) => ({ ...l, [idx]: true }));
      const qs = new URLSearchParams({
        country: slot.country,
        industry: slot.industry,
      });
      if (slot.region) qs.set("region", slot.region);
      fetch(`/api/cell-lookup?${qs.toString()}`)
        .then((r) => r.json())
        .then((j) => {
          setCells((c) => ({ ...c, [idx]: j.cell || null }));
        })
        .catch(() => setCells((c) => ({ ...c, [idx]: null })))
        .finally(() => setLoading((l) => ({ ...l, [idx]: false })));
    });
  }, [slots]);

  function updateSlot(idx: number, field: keyof Slot, value: string) {
    setSlots((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    );
  }

  // Load slots from ?q= on mount and write current slots back so the
  // comparison is shareable. Reads off the router's searchParams so it agrees
  // with the weight hook, which reads the same store.
  useEffect(() => {
    const q = searchParams.get("q");
    if (!q) return;
    try {
      const parsed = JSON.parse(decodeURIComponent(q));
      if (Array.isArray(parsed) && parsed.length === SLOT_COUNT) {
        setSlots(parsed);
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist the slots into ?q= through the router (not raw history), merging
  // over the current params so the weight keys (?w*) survive, and vice versa.
  // scroll:false keeps the page anchored as the address bar catches up.
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", encodeURIComponent(JSON.stringify(slots)));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // The slots are the trigger; the router primitives are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots]);

  function copyShareLink() {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href).catch(() => {});
  }

  // The place label for a column, falling back through region name, country
  // name, then a stable placeholder so a column always names itself.
  function slotLabel(i: number): string {
    const c = cells[i];
    return (
      c?.region ||
      COUNTRIES.find((x) => x.code === slots[i].country)?.name ||
      slots[i].country ||
      `City ${i + 1}`
    );
  }

  function activityLabel(i: number): string {
    const id = slots[i].industry;
    if (id && INDUSTRY_BY_ID[id]) return INDUSTRY_BY_ID[id].name;
    return cells[i]?.industry || MISSING;
  }

  // The columns to render: every slot that has loaded a cell, in order.
  const activeCols = useMemo(
    () => slots.map((_, i) => i).filter((i) => cells[i] != null),
    [slots, cells],
  );

  const anyData = activeCols.length > 0;
  const anyLoading = slots.some((_, i) => loading[i]);

  // Whether the active columns span more than one country. Raw USD figures are
  // not adjusted for local prices or cost of living, so calling one country the
  // "winner" on a larger number is the exact nonsense the founder flagged (a
  // poorer country appearing to out-earn a richer one). When columns span
  // countries we drop every leader mark and the biggest-difference callout, and
  // show a caveat instead. Within one country (US states, say) the marks stay.
  const spansCountries = useMemo(() => {
    const codes = new Set(
      activeCols.map((i) => slots[i]?.country).filter(Boolean),
    );
    return codes.size > 1;
  }, [activeCols, slots]);

  // Per-row strongest value across the active columns, used to mark the leader.
  // Only meaningful when at least two columns carry the figure and the leader
  // is not tied with the trailer. Suppressed entirely across countries.
  function rowLeader(
    row: MetricRow,
  ): { best: number | null; worst: number | null } {
    if (spansCountries) return { best: null, worst: null };
    if (!row.numeric) return { best: null, worst: null };
    const vals = activeCols
      .map((i) => row.numeric!(cells[i] as CompactCell))
      .filter((v): v is number => isNum(v));
    if (vals.length < 2) return { best: null, worst: null };
    return { best: Math.max(...vals), worst: Math.min(...vals) };
  }

  // The single biggest differentiator: among the comparable numeric rows
  // flagged `differ`, the one whose values vary most across the active columns
  // in relative terms. Computed honestly from the loaded figures; null when
  // fewer than two columns carry any single comparable row, or every such row
  // is effectively flat.
  const differentiator = useMemo(() => {
    if (activeCols.length < 2) return null;
    // No single "biggest difference" across price regimes: a raw-USD swing
    // between countries is not a like-for-like read. The caveat box stands in.
    if (spansCountries) return null;

    type Candidate = {
      label: string;
      spread: number; // relative spread (max-min)/|min|, the ranking key
      hiIdx: number;
      loIdx: number;
      hiVal: string;
      loVal: string;
    };
    let best: Candidate | null = null;

    for (const group of GROUPS) {
      for (const row of group.rows) {
        if (!row.differ || !row.numeric) continue;
        const present = activeCols
          .map((i) => ({ i, v: row.numeric!(cells[i] as CompactCell) }))
          .filter((r): r is { i: number; v: number } => isNum(r.v) && r.v !== 0);
        if (present.length < 2) continue;
        present.sort((a, b) => b.v - a.v);
        const hi = present[0];
        const lo = present[present.length - 1];
        const denom = Math.abs(lo.v);
        if (denom === 0) continue;
        const spread = (hi.v - lo.v) / denom;
        // Ignore essentially flat rows (under ~8% relative spread): there is no
        // honest "biggest difference" to call out.
        if (spread < 0.08) continue;
        if (!best || spread > best.spread) {
          best = {
            label: row.label,
            spread,
            hiIdx: hi.i,
            loIdx: lo.i,
            hiVal: row.value(cells[hi.i] as CompactCell),
            loVal: row.value(cells[lo.i] as CompactCell),
          };
        }
      }
    }
    return best;
  }, [activeCols, cells, spansCountries]);

  // Where each one wins: a balanced, honest read built from the loaded figures
  // via the shared compare-verdict module. It crowns wins per metric (revenue,
  // pay, predictability) and names the catch each time, never "this one is bad".
  //
  // The spansCountries guard holds here too: across price regimes a raw-USD
  // revenue or wage "win" is the same nonsense the leader marks suppress, so we
  // withhold the money-based wins and let the module lead on predictability and
  // the explicit caveat instead. Within one country every win stands.
  const verdict = useMemo(() => {
    if (activeCols.length < 2) return null;
    const sides: CompareSide[] = activeCols.map((i) => {
      const c = cells[i] as CompactCell;
      return {
        index: i,
        place: slotLabel(i),
        industry: activityLabel(i),
        typical: c.revenue_per_firm,
        p10: c.rev_p10,
        p90: c.rev_p90,
        wagePerEmployee: c.payroll_per_employee,
        quality: c.quality_score,
      };
    });
    const v = generateCompareVerdict(sides);
    if (spansCountries) {
      // Drop the money-led wins (Typical revenue, Pays staff) that are not
      // like-for-like across currencies; keep the predictability read.
      const wins = v.wins.filter((w) => w.metric === "Most predictable");
      return {
        headline: "No single winner across countries",
        lead: "These sit in different price regimes, so a bigger revenue or wage number does not make one the better business. The honest read is the shape: how predictable each one is, and the cost base you would bring to it.",
        close: v.close,
        wins,
      };
    }
    return v;
    // slotLabel / activityLabel read slots + cells, captured below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCols, cells, spansCountries, slots]);

  // ----- The reader's own weights (P3: every weight lives in the URL) -----
  // One integer field per metric (`wtake`, `wmargin`, ...) plus a `wlock` token
  // list of the metrics the reader has pinned. A weight at its default drops out
  // of the URL so a shared link only carries what the reader actually changed;
  // an empty lock set drops `wlock`. All of it is one coalesced write per change.
  // The field config is module-constant (WEIGHT_FIELDS), so the hook re-derives
  // only when the query string changes.
  const { values: weightValues, set: setWeights, reset: resetWeights } =
    useUrlStateMap<WeightState>(WEIGHT_FIELDS);

  // The live weights keyed by metric key, and the locked-key set, read off the
  // URL state so the address bar is the single source of truth (back-safe).
  const weights = useMemo(() => {
    const out: Record<string, number> = {};
    for (const m of WEIGHT_METRICS) {
      out[m.key] = (weightValues[`w${m.key}` as WeightFieldKey] as number) ?? DEFAULT_WEIGHT;
    }
    return out;
  }, [weightValues]);

  const lockedKeys = useMemo(
    () => new Set(weightValues.wlock ?? []),
    [weightValues.wlock],
  );

  // Whether the reader has bent any weight off its default. Drives the quiet
  // "Reset weights" disclosure (P5: shown only once there is something to undo).
  const weightsAdjusted = useMemo(
    () =>
      WEIGHT_METRICS.some((m) => weights[m.key] !== DEFAULT_WEIGHT) ||
      lockedKeys.size > 0,
    [weights, lockedKeys],
  );

  function setWeight(key: string, next: number) {
    setWeights({ [`w${key}`]: next } as Partial<WeightState>);
  }

  function toggleLock(key: string) {
    const nextLocked = new Set(lockedKeys);
    if (nextLocked.has(key)) nextLocked.delete(key);
    else nextLocked.add(key);
    setWeights({ wlock: [...nextLocked] });
  }

  // Reset weights, but honor the locks: a pinned weight survives the reset (it is
  // the reader's anchor), and the locks themselves stay set. Unlocked weights
  // fall back to the flat default by dropping their URL key.
  function resetUnlockedWeights() {
    if (lockedKeys.size === 0) {
      resetWeights();
      return;
    }
    const patch: Partial<WeightState> = {};
    for (const m of WEIGHT_METRICS) {
      if (!lockedKeys.has(m.key)) patch[`w${m.key}` as WeightFieldKey] = DEFAULT_WEIGHT;
    }
    setWeights(patch);
  }

  // The personalized standing: the active columns re-ranked by the reader's
  // weights, live. Money metrics drop out across countries (the same like-for-
  // like rule the house verdict and leader marks honor). Cheap client math, so
  // it re-derives on every weight tick with no Apply and no server round-trip.
  const personalStanding = useMemo(
    () => scoreByWeights(activeCols, cells, weights, spansCountries),
    [activeCols, cells, weights, spansCountries],
  );

  // The columns that carry a usable revenue spread, used to decide whether the
  // standalone RangeStrip section (lifted out of the table) renders at all.
  const spreadCols = useMemo(
    () =>
      activeCols.filter((i) => {
        const c = cells[i] as CompactCell | null;
        return (
          c != null &&
          isNum(c.rev_p10) &&
          isNum(c.rev_p90) &&
          (c.rev_p90 as number) > (c.rev_p10 as number)
        );
      }),
    [activeCols, cells],
  );

  // The sticky in-page nav. Built from the sections that will actually render,
  // so an absent block never leaves a dead anchor. Shows once the page is long
  // enough to be worth jumping around (StickySectionNav itself hides under two).
  const navSections = useMemo(() => {
    // Every required section (pickers, where-each-wins, grid) is always present
    // now, so the nav lists all three in DOM order. The revenue-spread block is
    // a curated extra, so it joins the nav only when it carries data.
    const nav: Array<{ id: string; label: string }> = [
      { id: "compare-pickers", label: "Set the matchup" },
      { id: "where-each-wins", label: "Where each wins" },
    ];
    if (spreadCols.length > 0) nav.push({ id: "revenue-spread", label: "Revenue spread" });
    nav.push({ id: "compare-grid", label: "Side by side" });
    return nav;
  }, [spreadCols]);

  return (
    <div className="xl:flex xl:gap-12">
      <div className="min-w-0 flex-1 space-y-12 md:space-y-16">
      {/* ----- Pick the matchup ----- */}
      {/* <HeroWash category="business"> REMOVED. .atlas-wash paints
          var(--atlas-surface-paper) as its BASE layer, fully opaque, under the
          radial tint, so it covered the fixed page photograph across the whole
          column for the height of this block: an opaque plate at the top of the
          page, which is where the founder is most explicit that the picture
          must still read. Same removal, same reason, as the city page in
          4acfb611 and /learn in 1bdb96bb. The section is a card instead, which
          is where legibility is supposed to come from. */}
      <section id="compare-pickers" aria-label="Set the matchup" className="atlas-card px-5 py-6 md:px-7 md:py-7">
        {/* The masthead H1 owns the headline; the pickers carry only their quiet
            eyebrow + instruction, not a second near-duplicate H2. */}
        <SectionEyebrow className="mb-1">Set the matchup</SectionEyebrow>
        <p className="mt-1 max-w-2xl text-base leading-relaxed text-graphite">
          Pick a country, region, and activity for each column. The grid below
          updates as you change them.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot, idx) => (
            <div
              key={idx}
              /* Nested one level inside the picker card above, so the soft
                 variant: two translucent fills stacked only muddy the picture
                 under both. */
              className="atlas-card-soft space-y-3 p-4"
            >
              <SectionEyebrow size="md">City {idx + 1}</SectionEyebrow>
              <ComboField
                id={`country-${idx}`}
                label="Country"
                options={countryOptions}
                value={slot.country}
                onChange={(v) => {
                  updateSlot(idx, "country", v);
                  // Reset region when the country changes so the first option
                  // of the new country takes effect.
                  const name = COUNTRIES.find((c) => c.code === v)?.name || v;
                  const opts = getRegionsForCountry(v, name);
                  updateSlot(idx, "region", opts[0]?.value || "");
                }}
              />
              {(() => {
                const name =
                  COUNTRIES.find((c) => c.code === slot.country)?.name ||
                  slot.country;
                const regionOpts = getRegionsForCountry(slot.country, name);
                return (
                  <div>
                    <label
                      htmlFor={`region-${idx}`}
                      className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-cocoa-700"
                    >
                      Region
                    </label>
                    <select
                      id={`region-${idx}`}
                      value={slot.region}
                      onChange={(e) => updateSlot(idx, "region", e.target.value)}
                      className="w-full rounded-xl border border-parchment bg-white px-3.5 py-2.5 text-sm font-medium text-ink-900 transition-colors hover:border-atlas-300 focus-visible:border-atlas-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/30"
                    >
                      {regionOpts.map((r) => (
                        <option key={r.value || "country-level"} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })()}
              <ComboField
                id={`industry-${idx}`}
                label="Activity"
                options={industryOptions}
                value={slot.industry}
                onChange={(v) => updateSlot(idx, "industry", v)}
              />
              {slot.industry && cells[idx]?.cellUrl ? (
                <a
                  href={cells[idx]?.cellUrl || "#"}
                  className="inline-block text-xs font-medium text-atlas-700 hover:underline"
                >
                  Open the full page
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* ----- Where each one wins (the balanced verdict) -----
          Always present (the founder's section contract): the balanced verdict
          when at least two columns are loaded and the verdict crowns a win, a
          calm placeholder otherwise. It never self-omits. The spansCountries
          guard above still withholds the money wins inside the verdict. The
          reader's own weighting + personalized verdict are disclosed below the
          house read once there are two columns to weigh. */}
      {verdict ? (
        <section id="where-each-wins" aria-label="Where each one wins">
          {verdict.wins.length > 0 ? (
            <>
              <HonestTakeBox
                eyebrow="Where each one wins"
                verdict={verdict.headline}
              >
                <p>{verdict.lead}</p>
                <p className="text-cocoa-700/90">{verdict.close}</p>
              </HonestTakeBox>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {verdict.wins.map((w) => (
                  <div
                    key={w.metric}
                    className="atlas-card-soft px-4 py-4"
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-cocoa-500">
                      {w.metric}
                    </div>
                    <div className="mt-1 font-display text-base font-semibold tracking-tight text-ink-900">
                      {w.winnerName}
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-cocoa-700/90">
                      {w.reading}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <HonestTakeBox eyebrow="Where each one wins" verdict={verdict.headline}>
              <p>{verdict.lead}</p>
              <p className="text-cocoa-700/90">{verdict.close}</p>
            </HonestTakeBox>
          )}

          {activeCols.length >= 2 ? (
            <WeightingPanel
              metrics={WEIGHT_METRICS}
              weights={weights}
              lockedKeys={lockedKeys}
              spansCountries={spansCountries}
              adjusted={weightsAdjusted}
              initiallyOpen={weightsAdjusted}
              standing={personalStanding}
              onWeight={setWeight}
              onToggleLock={toggleLock}
              onReset={resetUnlockedWeights}
              slotLabel={slotLabel}
              activityLabel={activityLabel}
            />
          ) : null}
        </section>
      ) : (
        <SectionEmpty
          id="where-each-wins"
          eyebrow="Where each wins"
          heading="Where each one wins"
          note="Pick two places to see where each one wins, and the catch in each."
        />
      )}

      {/* ----- The revenue spread (lifted out of the table) ----- */}
      {spreadCols.length > 0 ? (
        <section id="revenue-spread" aria-label="Revenue spread">
          <SectionEyebrow className="mb-3">Revenue spread</SectionEyebrow>
          <h2 className="font-display text-2xl font-medium tracking-tight text-ink-900 md:text-3xl">
            How wide the typical number runs
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-graphite">
            The middle firm is only half the story. Each strip runs from the
            bottom tenth to the top tenth, with the typical operator marked, so
            you can see how much the headline number hides in each place.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {spreadCols.map((i) => {
              const c = cells[i] as CompactCell;
              return (
                <div
                  key={i}
                  className="atlas-card px-5 py-5"
                >
                  <div className="mb-3">
                    <span className="block font-display text-base font-semibold text-ink-900">
                      {slotLabel(i)}
                    </span>
                    <span className="block text-[11px] text-cocoa-500">
                      {activityLabel(i)}
                    </span>
                  </div>
                  <RangeStrip
                    p10={c.rev_p10}
                    p25={c.rev_p25}
                    p50={c.revenue_per_firm ?? c.rev_p50}
                    p75={c.rev_p75}
                    p90={c.rev_p90}
                    format={fmtUSD}
                  />
                </div>
              );
            })}
          </div>
          {spansCountries ? (
            <p className="mt-4 text-[11px] leading-relaxed text-cocoa-500">
              Shown in US dollars and not adjusted for local prices, so compare
              the width of each spread, not one place against another.
            </p>
          ) : null}
        </section>
      ) : null}

      {/* ----- The comparison ----- */}
      <section id="compare-grid" aria-labelledby="compare-grid-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <SectionEyebrow className="mb-3">Side by side</SectionEyebrow>
            <h2
              id="compare-grid-heading"
              className="font-display text-2xl font-medium tracking-tight text-ink-900 md:text-3xl"
            >
              The same business in each city
            </h2>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-graphite">
              Each row is a decisive figure, each column a city. A dash means
              that figure is not held for that place. Revenue is a typical
              firm&apos;s yearly sales, not what an owner keeps.
            </p>
          </div>
          <button
            type="button"
            onClick={copyShareLink}
            className="rounded-full border border-parchment bg-cream-100 px-3.5 py-1.5 text-xs font-medium text-ink-900 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/30"
          >
            Copy share link
          </button>
        </div>

        {/* The biggest difference, computed from the loaded figures. Within one
            country only: across countries the caveat below stands in. */}
        {differentiator ? (
          <div className="mt-6 rounded-lg border border-atlas-200 bg-atlas-50/60 p-4">
            <SectionEyebrow size="md" className="mb-1.5">
              The biggest difference
            </SectionEyebrow>
            <p className="text-base leading-relaxed text-ink-900">
              {differentiator.label} swings the most:{" "}
              <span className="font-semibold tabular-nums">
                {differentiator.hiVal}
              </span>{" "}
              in {slotLabel(differentiator.hiIdx)} versus{" "}
              <span className="font-semibold tabular-nums">
                {differentiator.loVal}
              </span>{" "}
              in {slotLabel(differentiator.loIdx)}.
            </p>
          </div>
        ) : spansCountries && anyData ? (
          <div className="mt-6 rounded-lg border border-cocoa-200 bg-cream-100 p-4">
            <SectionEyebrow size="md" className="mb-1.5">
              Reading across countries
            </SectionEyebrow>
            <p className="text-base leading-relaxed text-ink-900">
              These columns sit in different countries. Money is shown in US
              dollars and is not adjusted for local prices or cost of living, so
              a bigger number does not mean a better business. Read the shape,
              margins, survival, and the revenue spread, rather than the raw
              totals. No winner is crowned here, and that is deliberate.
            </p>
          </div>
        ) : null}

        {!anyData && !anyLoading ? (
          <p className="mt-6 text-sm leading-relaxed text-cocoa-500">
            Pick a country and an activity for at least one city above to see the
            comparison.
          </p>
        ) : (
          <>
            {/* sm and up: the full side-by-side table. Hidden below sm so the
                primary comparison never sits behind horizontal scroll. */}
            <div className="mt-6 hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[34rem] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-parchment text-left align-bottom">
                    <th className="w-44 py-2 pr-4 text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">
                      Metric
                    </th>
                    {activeCols.map((i) => (
                      <th key={i} className="px-3 py-2 align-bottom">
                        <span className="block font-display text-base font-semibold text-ink-900">
                          {slotLabel(i)}
                        </span>
                        <span className="block text-[11px] font-normal text-cocoa-500">
                          {activityLabel(i)}
                        </span>
                      </th>
                    ))}
                    {anyLoading && activeCols.length === 0 ? (
                      <th className="px-3 py-2 text-[11px] font-normal text-cocoa-500">
                        loading
                      </th>
                    ) : null}
                  </tr>
                </thead>
                <tbody className="text-ink-900">
                  {/* The revenue spread was lifted out of this table into its own
                      seven-stop RangeStrip section above the grid, so the numbers
                      group now reads as clean rows. */}
                  {GROUPS.map((group) => (
                    <GroupBlock
                      key={group.key}
                      group={group}
                      activeCols={activeCols}
                      cells={cells}
                      rowLeader={rowLeader}
                      spansCountries={spansCountries}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Below sm: the same figures reflowed into stacked, labeled groups
                so every city column stays readable without horizontal scroll.
                One card per metric row; inside, one labeled line per city. The
                leader marks, money caveat, and spansCountries suppression all
                carry over from the table above. CSS-only toggle, no JS. */}
            <div className="mt-6 space-y-6 sm:hidden">
              {GROUPS.map((group) => (
                <GroupBlockStacked
                  key={group.key}
                  group={group}
                  activeCols={activeCols}
                  cells={cells}
                  rowLeader={rowLeader}
                  spansCountries={spansCountries}
                  slotLabel={slotLabel}
                  activityLabel={activityLabel}
                />
              ))}
            </div>
          </>
        )}
      </section>
      </div>
      <StickySectionNav sections={navSections} />
    </div>
  );
}

/**
 * The personalized one-line verdict, derived from the weighted standing. Honest
 * by construction: it crowns a place only when the lead is decisive, names the
 * single metric that carried it, and stays quiet ("too close to call") when the
 * weights leave a near-tie. When the columns span countries it says so plainly,
 * since the money metrics that often decide it were dropped from the score.
 */
function personalVerdictLine(
  standing: {
    standings: WeightedStanding[];
    decisive: boolean;
    anyWeight: boolean;
    anyWeightAtAll: boolean;
  },
  spansCountries: boolean,
  slotLabel: (i: number) => string,
): { headline: string; note: string } {
  const { standings, decisive, anyWeight, anyWeightAtAll } = standing;
  if (!anyWeight) {
    // Across countries the reader may have weighted only money metrics, which we
    // leave out: say so plainly rather than claim every weight is at zero.
    if (spansCountries && anyWeightAtAll) {
      return {
        headline: "Your weights are all on money figures",
        note: "Across countries the money measures are left out, since they are not adjusted for local prices. Add weight to margin, break-in ease, or rent to get a like-for-like pick.",
      };
    }
    return {
      headline: "Every weight is at zero",
      note: "Raise at least one weight to get a pick for what you care about.",
    };
  }
  if (standings.length < 2) {
    return {
      headline: "Pick two places to weigh",
      note: "Load a second column to rank them by your weights.",
    };
  }
  const leader = slotLabel(standings[0].index);
  if (!decisive) {
    return {
      headline: "Too close to call on your weights",
      note: "The top two come out within a hair on what you have said matters. Lean on the catch in each, or weight the thing that really decides your year.",
    };
  }
  const carriedBy = standings[0].topMetricLabel;
  const because = carriedBy ? `, mostly on ${carriedBy.toLowerCase()}` : "";
  const headline = `For what you care about, ${leader} wins`;
  const note = spansCountries
    ? `It leads on the weights you set${because}. These sit in different countries, so the money weights are left out of this pick and only the like-for-like measures count.`
    : `It comes out ahead on the balance of what you weighted${because}. Move a weight and the pick updates; the side-by-side below still shows every figure behind it.`;
  return { headline, note };
}

/**
 * The reader's own weighting + personalized verdict (agency principles P1-P5).
 *
 * P5 (disclosed not displayed): collapsed behind a quiet "Make it yours" toggle,
 * so the house read leads and the controls appear only on intent. P1 + P2 (act
 * in place, no Apply): each Slider re-ranks the columns live, client-side. P3
 * (reversible, canonical beside adjusted): every weight is in the URL, the
 * personalized pick sits beside the house verdict above, and "Reset weights"
 * returns to the flat default (honoring any locks). A per-metric lock pins a
 * weight so a reset leaves it. Tokens only, AA, 44px targets, reduced-motion
 * safe via the kit Slider; no em-dashes, no source-agency names.
 */
function WeightingPanel({
  metrics,
  weights,
  lockedKeys,
  spansCountries,
  adjusted,
  initiallyOpen = false,
  standing,
  onWeight,
  onToggleLock,
  onReset,
  slotLabel,
  activityLabel,
}: {
  metrics: WeightMetric[];
  weights: Record<string, number>;
  lockedKeys: Set<string>;
  spansCountries: boolean;
  adjusted: boolean;
  /** Open on mount when the URL already carries weights, so a shared weighted
   *  link lands on the personalized verdict rather than the collapsed header. */
  initiallyOpen?: boolean;
  standing: {
    standings: WeightedStanding[];
    decisive: boolean;
    anyWeight: boolean;
    anyWeightAtAll: boolean;
  };
  onWeight: (key: string, next: number) => void;
  onToggleLock: (key: string) => void;
  onReset: () => void;
  slotLabel: (i: number) => string;
  activityLabel: (i: number) => string;
}) {
  const [open, setOpen] = useState(initiallyOpen);

  // Money metrics are inert across countries (dropped from the score), so we
  // dim them and say why rather than hide them: the reader still sees what was
  // set aside and that it was the like-for-like rule, not an arbitrary choice.
  const verdict = personalVerdictLine(standing, spansCountries, slotLabel);

  const leaderIdx =
    standing.decisive && standing.standings.length > 0
      ? standing.standings[0].index
      : null;

  return (
    <div className="atlas-card mt-5">
      {/* The quiet disclosure: house read leads, the reader's controls open on
          intent (P5). The button is the full-width header so the touch target
          is generous on a phone. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="weighting-body"
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2"
      >
        <span className="min-w-0">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-cocoa-500">
            Make it yours
          </span>
          <span className="mt-0.5 block text-sm leading-snug text-cocoa-700">
            Weight what matters, and the ranking follows.
          </span>
        </span>
        <svg
          viewBox="0 0 16 16"
          className={cn(
            "h-4 w-4 shrink-0 text-cocoa-500 transition-transform motion-reduce:transition-none",
            open ? "rotate-180" : "",
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      {open ? (
        <div id="weighting-body" className="border-t border-parchment px-5 pb-5 pt-4">
          {/* The personalized verdict: the live one-line pick, sitting beside
              the house read above so the reader sees both at once (P3). */}
          <div className="rounded-md border border-atlas-200 bg-atlas-50/60 px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-cocoa-500">
              Your pick
            </div>
            <p
              className="mt-1 font-display text-lg font-semibold leading-snug tracking-tight text-ink-900"
              aria-live="polite"
            >
              {verdict.headline}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-cocoa-700/90">
              {verdict.note}
            </p>
            {/* The full weighted order, so the pick is never a black box. */}
            {standing.standings.length >= 2 && standing.anyWeight ? (
              <ol className="mt-3 space-y-1.5">
                {standing.standings.map((s, rank) => {
                  const isLeader = s.index === leaderIdx;
                  return (
                    <li
                      key={s.index}
                      className="flex items-baseline justify-between gap-3 text-sm"
                    >
                      <span className="flex min-w-0 items-baseline gap-2">
                        <span className="text-[11px] tabular-nums text-cocoa-500">
                          {rank + 1}
                        </span>
                        <span
                          className={cn(
                            "truncate",
                            isLeader
                              ? "font-semibold text-atlas-700"
                              : "text-ink-900",
                          )}
                        >
                          {slotLabel(s.index)}
                        </span>
                        <span className="truncate text-[11px] text-cocoa-500">
                          {activityLabel(s.index)}
                        </span>
                      </span>
                      <span className="shrink-0 text-[11px] tabular-nums text-cocoa-500">
                        {Math.round(s.total * 100)}
                      </span>
                    </li>
                  );
                })}
              </ol>
            ) : null}
          </div>

          {/* The weight sliders, one per metric. Each carries a lock toggle that
              pins the weight against a reset. Live re-rank, no Apply (P1/P2). */}
          <div className="mt-4 space-y-4">
            {metrics.map((m) => {
              const inert = spansCountries && m.money;
              const locked = lockedKeys.has(m.key);
              return (
                <div
                  key={m.key}
                  className={cn(
                    "rounded-md border border-parchment/70 bg-cream-75 px-4 py-3",
                    inert ? "opacity-60" : "",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <Slider
                        id={`weight-${m.key}`}
                        label={m.label}
                        min={WEIGHT_MIN}
                        max={WEIGHT_MAX}
                        step={5}
                        value={weights[m.key]}
                        onChange={(n) => onWeight(m.key, n)}
                        format={(n) => `${n}`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleLock(m.key)}
                      aria-pressed={locked}
                      aria-label={
                        locked
                          ? `${m.label} weight is pinned, unpin it`
                          : `Pin the ${m.label} weight so a reset leaves it`
                      }
                      title={locked ? "Pinned. A reset leaves it." : "Pin this weight"}
                      className={cn(
                        "mt-6 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2",
                        locked
                          ? "border-atlas-300 bg-atlas-50 text-atlas-700"
                          : "border-parchment bg-white text-cocoa-500 hover:text-ink-900",
                      )}
                    >
                      <LockGlyph locked={locked} />
                    </button>
                  </div>
                  {inert ? (
                    <p className="mt-1.5 text-[11px] leading-relaxed text-cocoa-500">
                      Left out across countries. Money figures are not adjusted
                      for local prices, so this weight does not decide the pick
                      here.
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* The way back (P3), disclosed only once a weight has moved (P5). A
              lock keeps its weight through the reset; the copy says so. */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-[11px] leading-relaxed text-cocoa-500">
              {lockedKeys.size > 0
                ? "Reset returns the rest to an even weight and leaves your pinned ones."
                : "Weights live in the link, so a weighted comparison is shareable."}
            </p>
            {adjusted ? (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-cocoa-700 transition-colors hover:bg-cream-100 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 8a5 5 0 1 1 1.6 3.7" />
                  <path d="M3 5v3h3" />
                </svg>
                Reset weights
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** The lock glyph: a closed padlock when pinned, an open one otherwise. Weight
 *  (fill of the shackle) carries the state so it reads without relying on hue. */
function LockGlyph({ locked }: { locked: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
      {locked ? (
        <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
      ) : (
        <path d="M5.5 7V5a2.5 2.5 0 0 1 4.8-1" />
      )}
    </svg>
  );
}

/**
 * One labelled group of the comparison grid (a board section rendered as
 * rows). Emits a group header row, then one row per metric. The strongest
 * numeric value in a row is marked (bold + moss); ties and single-value rows
 * stay neutral. Blanks render as the board dash.
 */
function GroupBlock({
  group,
  activeCols,
  cells,
  rowLeader,
  spansCountries,
}: {
  group: MetricGroup;
  activeCols: number[];
  cells: Record<number, CompactCell | null>;
  rowLeader: (row: MetricRow) => { best: number | null; worst: number | null };
  spansCountries: boolean;
}) {
  // The money group carries an inline reminder when columns span countries, so
  // the "USD, not price-adjusted" caveat sits right beside the figures it
  // qualifies, not only in the box above the grid.
  const moneyCaveat = spansCountries && group.key === "numbers";
  // Self-omit empty rows and empty groups: a row every active column dashes is
  // noise, and a whole group of them is the dash-wall the design forbids. Only
  // rows where at least one column carries a value render; a group with none
  // disappears entirely (header included).
  const isRowPresent = (row: MetricRow) =>
    activeCols.some((i) => row.value(cells[i] as CompactCell) !== MISSING);
  const visibleRows = group.rows.filter(isRowPresent);
  if (visibleRows.length === 0) return null;
  return (
    <>
      <tr>
        <td colSpan={activeCols.length + 1} className="pb-1 pt-5">
          <SectionEyebrow size="md">{group.title}</SectionEyebrow>
          {moneyCaveat ? (
            <span className="mt-0.5 block text-[11px] font-normal normal-case tracking-normal text-cocoa-500">
              USD, not adjusted for local prices.
            </span>
          ) : null}
        </td>
      </tr>
      {visibleRows.map((row) => {
        const { best, worst } = rowLeader(row);
        return (
          <tr key={row.label} className="border-b border-parchment/50">
            <td className="py-2.5 pr-4 align-top text-cocoa-500">
              {row.label}
              {row.hint ? (
                <span className="mt-0.5 block text-[11px] text-cocoa-400">
                  {row.hint}
                </span>
              ) : null}
            </td>
            {activeCols.map((i) => {
              const c = cells[i] as CompactCell;
              const display = row.value(c);
              const blank = display === MISSING;
              const raw = row.numeric ? row.numeric(c) : null;
              const canRank = best != null && worst != null && best !== worst;
              // Mark the strongest value in a row, using weight as the primary
              // cue (not colour alone) so it reads without relying on hue. For
              // cost-share rows lower is stronger; everywhere else higher is.
              const isBest =
                canRank &&
                isNum(raw) &&
                raw === (row.higherIsStronger === false ? worst : best);
              const tone = blank
                ? "text-cocoa-400"
                : isBest
                  ? "font-semibold text-atlas-700"
                  : "text-ink-900";
              return (
                <td
                  key={i}
                  className={`px-3 py-2.5 align-top tabular-nums ${tone}`}
                >
                  {row.node ? row.node(c) : display}
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}

/**
 * The mobile reflow of one comparison group (below the 'sm' breakpoint). Mirrors
 * GroupBlock's data exactly, but stacks the figures so every city column is read
 * top to bottom without horizontal scroll: a group header, then one card per
 * metric row, and inside each card one labelled line per active city (the place
 * name and activity on the left, its value on the right). The strongest value in
 * a row carries the same weight + moss cue as the table, suppressed across
 * countries; the money caveat sits under the group title just as it does there.
 * No new JS: this is the same derived data, laid out for narrow screens.
 */
function GroupBlockStacked({
  group,
  activeCols,
  cells,
  rowLeader,
  spansCountries,
  slotLabel,
  activityLabel,
}: {
  group: MetricGroup;
  activeCols: number[];
  cells: Record<number, CompactCell | null>;
  rowLeader: (row: MetricRow) => { best: number | null; worst: number | null };
  spansCountries: boolean;
  slotLabel: (i: number) => string;
  activityLabel: (i: number) => string;
}) {
  const moneyCaveat = spansCountries && group.key === "numbers";
  const isRowPresent = (row: MetricRow) =>
    activeCols.some((i) => row.value(cells[i] as CompactCell) !== MISSING);
  const visibleRows = group.rows.filter(isRowPresent);
  if (visibleRows.length === 0) return null;
  return (
    <section aria-label={group.title}>
      <SectionEyebrow size="md">{group.title}</SectionEyebrow>
      {moneyCaveat ? (
        <span className="mt-0.5 block text-[11px] text-cocoa-500">
          USD, not adjusted for local prices.
        </span>
      ) : null}
      <div className="mt-3 space-y-3">
        {visibleRows.map((row) => {
          const { best, worst } = rowLeader(row);
          const canRank = best != null && worst != null && best !== worst;
          return (
            <div
              key={row.label}
              className="rounded-md border border-parchment/70 bg-cream-75 px-4 py-3"
            >
              <div className="text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">
                {row.label}
              </div>
              {row.hint ? (
                <div className="mt-0.5 text-[11px] text-cocoa-500">
                  {row.hint}
                </div>
              ) : null}
              <dl className="mt-2.5 space-y-2">
                {activeCols.map((i) => {
                  const c = cells[i] as CompactCell;
                  const display = row.value(c);
                  const blank = display === MISSING;
                  const raw = row.numeric ? row.numeric(c) : null;
                  const isBest =
                    canRank &&
                    isNum(raw) &&
                    raw === (row.higherIsStronger === false ? worst : best);
                  const tone = blank
                    ? "text-cocoa-400"
                    : isBest
                      ? "font-semibold text-atlas-700"
                      : "text-ink-900";
                  return (
                    <div
                      key={i}
                      className="flex items-baseline justify-between gap-3"
                    >
                      <dt className="min-w-0 text-sm text-cocoa-500">
                        <span className="block truncate font-medium text-ink-900">
                          {slotLabel(i)}
                        </span>
                        <span className="block truncate text-[11px] text-cocoa-500">
                          {activityLabel(i)}
                        </span>
                      </dt>
                      <dd
                        className={`shrink-0 text-right text-sm tabular-nums ${tone}`}
                      >
                        {row.node ? row.node(c) : display}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          );
        })}
      </div>
    </section>
  );
}
