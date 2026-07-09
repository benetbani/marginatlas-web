"use client";

/**
 * RecommendControls , the interactive island over the recommender query.
 *
 * Wave 1 Task 7. Owns only the QUERY (direction, trade-or-place text, budget) in
 * the URL via useUrlStateMap (src/lib/url_state.ts), one coalesced write per
 * change (P3: every adjustment lives in the URL and Back rewinds one step). On
 * this force-static dev route (./page.tsx) the SERVER always renders the fixed
 * default query (restaurants, places-for-trade): this island is a presentational
 * shell proving the controls read/write real URL state, not a live re-fetch. A
 * live route re-deriving the ranked result from these same URL keys is a later
 * wave; building that here would be scope creep for this task.
 *
 * It also renders a CompareTray with client-only selection state; the hand-off
 * to a real compare view is a later wave too. No composite math lives here.
 */
import * as React from "react";
import {
  ControlRail,
  CompareTray,
  type SignalDef,
  type TrayItem,
} from "@/components/spine/kit-index";
import { useUrlStateMap, type UrlStateField } from "@/lib/url_state";

/** The two resolver directions (src/lib/scores/recommend.ts: rankPlacesForTrade
 *  vs rankTradesForPlace). Standing in for ControlRail's segmented "sort", since
 *  there is no ranking-signal choice here, only which way the resolver runs. */
const DIRECTIONS: SignalDef[] = [
  { key: "places-for-trade", label: "Places for a trade" },
  { key: "trades-for-place", label: "Trades for a place" },
];

/** A slug-shaped URL slot: a bare lowercase-alnum-hyphen token, or the fallback.
 *  Mirrors the local `slugField` in src/app/decide/DecideWizard.tsx (url_state.ts
 *  exports no prebuilt field helpers, only the UrlStateField type + the hooks;
 *  every consumer defines its own small field configs against that type). Used
 *  here for the direction toggle and the trade-or-place text query, both of
 *  which resolve against slug tables (taxonomy / city_list). */
function slugField(fallback: string): UrlStateField<string> {
  return {
    parse: (raw) => (raw && /^[a-z0-9-]+$/.test(raw) ? raw : fallback),
    serialize: (v) => (v && v !== fallback ? v : null),
    fallback,
  };
}

/** Budget is a plain non-negative integer (US dollars), not slug-shaped. Its
 *  digits happen to pass slugField's [a-z0-9-] charset, but reusing a text field
 *  for a numeric control would blur the two, so this is its own small numeric
 *  field, the same local-field-config pattern WeightedCompare.tsx and
 *  CompareClient.tsx use for their weight sliders. `null` means "no budget cap"
 *  (matches page.tsx's `budgetUsd: null` default) and serializes to no key at
 *  all, keeping a plain link clean. */
const budgetField: UrlStateField<number | null> = {
  parse: (raw) => {
    if (raw == null || raw.trim() === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
  },
  serialize: (v) => (v == null ? null : String(v)),
  fallback: null,
};

/** The trade-or-place search text: a free-text box (ControlRail input), so it
 *  must preserve whatever the reader types (capitals and spaces, e.g. "New York"
 *  or "fine dining"). A slug field would reject those and snap the input back to
 *  empty on flush, making the box unusable. The live route normalizes this to a
 *  slug at resolve time. Empty serializes to no key so a plain link stays clean. */
const textField: UrlStateField<string> = {
  parse: (raw) => raw ?? "",
  serialize: (v) => (v.trim() === "" ? null : v),
  fallback: "",
};

type Query = { dir: string; q: string; budget: number | null };

export function RecommendControls() {
  const { values, set } = useUrlStateMap<Query>({
    dir: slugField("places-for-trade"),
    q: textField,
    budget: budgetField,
  });
  const { dir, q, budget } = values;

  // Compare-tray selection is client-only for this wave; nothing here reorders
  // or scores rows, it just collects a shortlist for a later hand-off.
  const [tray, setTray] = React.useState<TrayItem[]>([]);

  return (
    <div className="mb-6 flex flex-col gap-3">
      <ControlRail
        query={q}
        onQuery={(v) => set({ q: v })}
        sortKey={dir}
        sortOptions={DIRECTIONS}
        onSort={(key) => set({ dir: key })}
        placeholder={
          dir === "trades-for-place"
            ? "Which city? e.g. london"
            : "Which trade? e.g. restaurants"
        }
        // This island never sees the server's ranked row count (page.tsx renders
        // the fixed default query and does not thread a count back down); 0 is
        // the honest value here, not a live re-fetch stand-in.
        count={0}
      />
      <label className="flex max-w-[14rem] items-center gap-2 rounded-lg border border-[var(--c-border)] bg-[var(--c-soft)] px-2.5 py-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
          Budget
        </span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          step={1000}
          value={budget ?? ""}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") {
              set({ budget: null });
              return;
            }
            const n = Number(raw);
            if (Number.isFinite(n)) set({ budget: Math.max(0, Math.round(n)) });
          }}
          placeholder="No limit"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-[var(--c-ink)] outline-none placeholder:text-[var(--c-muted)]"
        />
      </label>
      <CompareTray
        items={tray}
        onRemove={(id) => setTray((prev) => prev.filter((t) => t.id !== id))}
        onClear={() => setTray([])}
      />
    </div>
  );
}
