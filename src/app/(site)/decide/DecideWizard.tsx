"use client";

/**
 * DecideWizard - the guided, three-step decision flow for /decide.
 *
 * Route-local client island for the /decide page upgrade. It turns the bare
 * activity+city picker into a calm, answer-oriented wizard that honors the five
 * agency principles:
 *
 *   Step 1  pick a trade        (Segmented over a curated short list + a full
 *                                searchable select for the long tail)
 *   Step 2  pick a place        (the same dual control over cities)
 *   Step 3  see the headline    (the trade's typical net margin, with a real
 *                                link to the live neighbourhood ranking / cell)
 *
 * P1 / P2: every choice acts in place and live, under 100ms, with no Apply
 *   button. The headline re-derives client-side from a small build-time table the
 *   server hands down (one net-margin number per trade), so no number is invented
 *   here and no server round-trip is needed to advance a step.
 * P3: the whole flow lives in the URL via useUrlStateMap (?trade=&place=), so any
 *   step is shareable and the Back button rewinds one choice at a time. The
 *   headline links onward to /decide/[trade]/[place] (and from there to the cell),
 *   so the deep answer is always one real, back-safe navigation away.
 * P4: a quiet step rail keeps the reader oriented in the flow.
 * P5: step 3 stays disclosed, not displayed: it appears only once both a trade
 *   and a place are chosen, and resets cleanly.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { useUrlStateMap } from "@/lib/url_state";
import { Segmented } from "@/components/kit";

export type WizardOption = { value: string; label: string };

export type DecideWizardProps = {
  /** Every selectable trade (slug + label), alphabetical. */
  trades: WizardOption[];
  /** A short, curated set of trades surfaced as quick Segmented chips. */
  featuredTrades: WizardOption[];
  /** Every selectable place (slug + label). */
  places: WizardOption[];
  /** A short, curated set of places surfaced as quick Segmented chips. */
  featuredPlaces: WizardOption[];
  /** trade slug -> typical net margin as a fraction (e.g. 0.114). Build-time
   *  resolved on the server from the same curated table the cell page uses, so
   *  the headline shown here matches the destination, never invented client-side. */
  tradeNetMargin: Record<string, number | null>;
};

/** Plain serializer pair for a slug-or-empty URL slot. */
const slugField = {
  parse: (raw: string | null) => (raw && /^[a-z0-9-]+$/.test(raw) ? raw : ""),
  serialize: (v: string) => (v ? v : null),
  fallback: "",
};

function StepDot({
  n,
  label,
  state,
}: {
  n: number;
  label: string;
  state: "done" | "active" | "todo";
}) {
  return (
    <li className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className={
          "inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums " +
          (state === "done"
            ? "bg-atlas-500 text-white"
            : state === "active"
              ? "bg-atlas-100 text-atlas-700 ring-2 ring-atlas-500/40"
              : "bg-cream-200 text-cocoa-500")
        }
      >
        {n}
      </span>
      <span
        className={
          "text-sm " +
          (state === "todo"
            ? "font-medium text-cocoa-500"
            : "font-semibold text-ink-900")
        }
      >
        {label}
      </span>
    </li>
  );
}

export function DecideWizard({
  trades,
  featuredTrades,
  places,
  featuredPlaces,
  tradeNetMargin,
}: DecideWizardProps) {
  // Both choices live in the URL as one coalesced write, so a fresh trade and a
  // fresh place can be set together without two competing history entries.
  const { values, set, reset } = useUrlStateMap<{ trade: string; place: string }>(
    {
      trade: slugField,
      place: slugField,
    },
  );
  const { trade, place } = values;

  const tradeLabel = React.useMemo(
    () => trades.find((t) => t.value === trade)?.label ?? "",
    [trades, trade],
  );
  const placeLabel = React.useMemo(
    () => places.find((p) => p.value === place)?.label ?? "",
    [places, place],
  );

  const hasTrade = trade !== "" && tradeLabel !== "";
  const hasPlace = place !== "" && placeLabel !== "";
  const ready = hasTrade && hasPlace;

  const stepState = (which: 1 | 2 | 3): "done" | "active" | "todo" => {
    if (which === 1) return hasTrade ? "done" : "active";
    if (which === 2) return hasPlace ? "done" : hasTrade ? "active" : "todo";
    return ready ? "active" : "todo";
  };

  // The headline number: the trade's typical net margin, server-resolved.
  const marginFraction = hasTrade ? tradeNetMargin[trade] ?? null : null;
  const marginPct =
    marginFraction != null ? (marginFraction * 100).toFixed(1) : null;

  const deepHref = ready ? `/decide/${trade}/${place}` : null;

  // Only the featured chips that are not already the current value need to show
  // the value; the searchable select always reflects the URL value.
  const featuredTradeValues = new Set(featuredTrades.map((o) => o.value));
  const featuredPlaceValues = new Set(featuredPlaces.map((o) => o.value));

  return (
    <div className="atlas-card p-6 md:p-8">
      {/* Quiet step rail (P4: oriented in the flow). */}
      <ol className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2">
        <StepDot n={1} label="Pick a trade" state={stepState(1)} />
        <span aria-hidden="true" className="text-cocoa-300">
          /
        </span>
        <StepDot n={2} label="Pick a place" state={stepState(2)} />
        <span aria-hidden="true" className="text-cocoa-300">
          /
        </span>
        <StepDot n={3} label="See the number" state={stepState(3)} />
      </ol>

      {/* Step 1: trade. */}
      <fieldset className="mb-6">
        <legend className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-atlas-700">
          Step 1 &middot; What trade
        </legend>
        <Segmented
          ariaLabel="Pick a trade"
          size="sm"
          className="mb-3"
          value={featuredTradeValues.has(trade) ? trade : ""}
          onChange={(next) => set({ trade: next })}
          options={[
            { value: "", label: "Browse all" },
            ...featuredTrades,
          ]}
        />
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-cocoa-700">
            Or choose from every trade
          </span>
          <select
            value={trade}
            onChange={(e) => set({ trade: e.target.value })}
            className="w-full rounded-lg border border-parchment bg-white px-3 py-2.5 text-sm font-medium text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2"
          >
            <option value="">Select a trade</option>
            {trades.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      {/* Step 2: place. Disclosed once a trade is chosen (P5). */}
      {hasTrade ? (
        <fieldset className="mb-6">
          <legend className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-atlas-700">
            Step 2 &middot; Where
          </legend>
          <Segmented
            ariaLabel="Pick a place"
            size="sm"
            className="mb-3"
            value={featuredPlaceValues.has(place) ? place : ""}
            onChange={(next) => set({ place: next })}
            options={[{ value: "", label: "Browse all" }, ...featuredPlaces]}
          />
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-cocoa-700">
              Or choose from every city
            </span>
            <select
              value={place}
              onChange={(e) => set({ place: e.target.value })}
              className="w-full rounded-lg border border-parchment bg-white px-3 py-2.5 text-sm font-medium text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2"
            >
              <option value="">Select a city</option>
              {places.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
        </fieldset>
      ) : null}

      {/* Step 3: the headline answer. Disclosed only once both are chosen (P5),
          answer-first, with the real link onward to the live ranking + cell. */}
      {ready ? (
        /* Nested inside the wizard's own .atlas-card, so the soft variant:
           two translucent fills stacked only muddy the picture under both. */
        <div className="atlas-card-soft p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-atlas-700">
            Step 3 &middot; The headline
          </div>
          <p className="mt-2 text-base leading-snug text-ink-900">
            A {tradeLabel.toLowerCase()} in {placeLabel}
            {marginPct != null ? (
              <>
                {" "}typically keeps{" "}
                <span className="font-display text-2xl font-semibold tabular-nums text-atlas-800">
                  {marginPct}%
                </span>{" "}
                of revenue as net margin, before the neighbourhood is chosen.
              </>
            ) : (
              <> sets the baseline we rank neighbourhoods against.</>
            )}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-cocoa-700">
            The best corner is rarely the busiest one. Open the live ranking to
            see which neighbourhood keeps the most once rent is paid.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href={deepHref ?? "#"}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-atlas-700 px-5 text-sm font-semibold text-white shadow-subtle transition-colors hover:bg-atlas-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2"
            >
              Rank the neighbourhoods &rarr;
            </a>
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-[44px] items-center rounded-full px-3 text-sm font-medium text-cocoa-700 transition-colors hover:text-atlas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2"
            >
              Start over
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
