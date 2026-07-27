"use client";

/**
 * MarginIndexControls , the interactive island over the /margin-index query.
 *
 * Wave 2 Task 4. Mirrors src/app/dev/decide-v2/recommend-client.tsx exactly: owns
 * only the direction toggle + a free-text trade-or-place query in the URL via
 * useUrlStateMap (real { values, set } API, src/lib/url_state.ts), one coalesced
 * write per change (P3: every adjustment lives in the URL and Back rewinds one
 * step). The server route (./page.tsx) always renders the fixed default board
 * (restaurants, places-for-trade): this island is a presentational shell proving
 * the controls read/write real URL state, not a live re-fetch. A live route
 * re-deriving the ranked board from these same URL keys is a later follow-up;
 * building that here would be scope creep for this task.
 */
import {
  ControlRail,
  type SignalDef,
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
 *  Mirrors the local `slugField` in recommend-client.tsx (url_state.ts exports no
 *  prebuilt field helpers, only the UrlStateField type + the hooks; every
 *  consumer defines its own small field configs against that type). */
function slugField(fallback: string): UrlStateField<string> {
  return {
    parse: (raw) => (raw && /^[a-z0-9-]+$/.test(raw) ? raw : fallback),
    serialize: (v) => (v && v !== fallback ? v : null),
    fallback,
  };
}

/** The trade-or-place search text: a free-text box (ControlRail input), so it
 *  must preserve whatever the reader types (capitals and spaces, e.g. "New York"
 *  or "fine dining"). A slug field would reject those and snap the input back to
 *  empty on flush, making the box unusable. Do NOT slug-validate this field. */
const textField: UrlStateField<string> = {
  parse: (raw) => raw ?? "",
  serialize: (v) => (v.trim() === "" ? null : v),
  fallback: "",
};

export function MarginIndexControls() {
  const { values, set } = useUrlStateMap<{ dir: string; q: string }>({
    dir: slugField("places-for-trade"),
    q: textField,
  });
  return (
    <ControlRail
      sortKey={values.dir}
      sortOptions={DIRECTIONS}
      onSort={(key) => set({ dir: key })}
      query={values.q}
      onQuery={(v) => set({ q: v })}
      placeholder={
        values.dir === "trades-for-place"
          ? "Which city? e.g. london"
          : "Which trade? e.g. restaurants"
      }
      // This island never sees the server's ranked row count (page.tsx renders
      // the fixed default board and does not thread a count back down); 0 is
      // the honest value here, not a live re-fetch stand-in.
      count={0}
    />
  );
}
