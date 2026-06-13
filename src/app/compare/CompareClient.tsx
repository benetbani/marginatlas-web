"use client";

import { useState, useMemo, useEffect, type ReactNode } from "react";
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
} from "@/components/kit";
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
type CompactCell = {
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

const DEFAULT_SLOTS: Slot[] = [
  { country: "US", industry: "", region: "california" },
  { country: "US", industry: "", region: "texas" },
  { country: "US", industry: "", region: "new-york" },
];

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

export function CompareClient() {
  const [slots, setSlots] = useState<Slot[]>(DEFAULT_SLOTS);
  const [cells, setCells] = useState<Record<number, CompactCell | null>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  // Default industry on mount.
  useEffect(() => {
    setSlots((prev) =>
      prev.map((s) => (s.industry ? s : { ...s, industry: "restaurants" })),
    );
  }, []);

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
  // comparison is shareable.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("q", encodeURIComponent(JSON.stringify(slots)));
    window.history.replaceState(null, "", url.toString());
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
      <section id="compare-pickers" aria-labelledby="compare-pickers-heading">
        <SectionEyebrow className="mb-3">Set the matchup</SectionEyebrow>
        <h2
          id="compare-pickers-heading"
          className="font-display text-2xl font-medium tracking-tight text-ink-900 md:text-3xl"
        >
          Up to three cities, side by side
        </h2>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-graphite">
          Pick a country, region, and activity for each column. The grid below
          updates as you change them.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot, idx) => (
            <div
              key={idx}
              className="space-y-3 rounded-lg border border-parchment/70 bg-cream-50 p-4"
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
          guard above still withholds the money wins inside the verdict. */}
      {verdict && verdict.wins.length > 0 ? (
        <section id="where-each-wins" aria-label="Where each one wins">
          <HonestTakeBox eyebrow="Where each one wins" verdict={verdict.headline}>
            <p>{verdict.lead}</p>
            <p className="text-cocoa-700/90">{verdict.close}</p>
          </HonestTakeBox>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {verdict.wins.map((w) => (
              <div
                key={w.metric}
                className="rounded-lg border border-parchment bg-cream-50 shadow-subtle px-4 py-4"
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
                  className="rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5"
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
              Each row is a decisive figure, each column a city. A dash means we
              do not hold that figure for that place. Revenue is a typical
              firm&apos;s yearly sales, not what an owner keeps.
            </p>
          </div>
          <button
            type="button"
            onClick={copyShareLink}
            className="rounded-full border border-parchment bg-cream-100 px-3.5 py-1.5 text-xs font-medium text-ink-900 transition-colors hover:bg-cream-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/30"
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
              totals, and we do not crown a winner here.
            </p>
          </div>
        ) : null}

        {!anyData && !anyLoading ? (
          <p className="mt-6 text-sm leading-relaxed text-cocoa-500">
            Pick a country and an activity for at least one city above to see the
            comparison.
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto">
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
        )}
      </section>
      </div>
      <StickySectionNav sections={navSections} />
    </div>
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
                  ? "font-semibold text-moss-700"
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
