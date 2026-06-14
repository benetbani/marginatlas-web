"use client";

/**
 * url_state - typed client hooks for reading and writing control state into the
 * query string (interaction-control foundation, agency principle P3).
 *
 * P3 says every adjustment is reversible and lives in the URL: a reader who
 * moves a slider, switches a venue, or watches a cell can copy the address bar
 * and land back on the exact same view, and the browser Back button rewinds one
 * change at a time. These hooks are the single place that contract is honored.
 *
 * Writes update the query string with router.replace(..., { scroll: false }) so
 * there is no full navigation and no scroll jump: the visible numbers stay put
 * while the address bar catches up. Rapid writes (a slider drag) are debounced
 * (~120ms) so we do not push a history entry per pixel; the latest value wins.
 *
 * SERVER MIRROR: a server component reads the SAME state from its `searchParams`
 * page prop. The key + parse used here should match the server's parse of
 * `searchParams[key]`, so the server render and the client hook agree on the
 * canonical value (no hydration drift). Example, in a page:
 *
 *   export default function Page({ searchParams }: { searchParams: { tip?: string } }) {
 *     const tip = searchParams.tip ? Number(searchParams.tip) : 18;
 *     // ...render with tip; the client <Slider> reads the same key via useUrlState
 *   }
 *
 * Pure-ish: no UI, no color, no tokens. Constraint-safe (no em-dashes, no
 * source-agency names).
 */
import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** A value-to-string serializer. Return `null` to REMOVE the key (back to the
 *  canonical default, keeping the URL clean). */
export type Serialize<T> = (value: T) => string | null;

/** A string-to-value parser. Receives `null` when the key is absent. */
export type Parse<T> = (raw: string | null) => T;

/** The debounce window for rapid writes (slider drags). Kept local so there is
 *  no raw-ms token leak into components; this is plain timer math, not styling. */
const WRITE_DEBOUNCE_MS = 120;

/**
 * A single typed URL-state slot.
 *
 * @param key       the query-string key (e.g. "tip", "venue", "size").
 * @param parse     turns the raw string (or null when absent) into T.
 * @param serialize turns T into a string, or null to drop the key.
 * @param fallback  the value used when the key is absent (the canonical default).
 *
 * Returns `[value, setValue, reset]`. `setValue` accepts a value or an updater.
 * `reset` removes the key (returns to `fallback`). Writes are debounced and
 * coalesced; the most recent value wins. Reads are live (re-render on Back/Fwd).
 */
export function useUrlState<T>(
  key: string,
  parse: Parse<T>,
  serialize: Serialize<T>,
  fallback: T,
): readonly [T, (next: T | ((prev: T) => T)) => void, () => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const raw = searchParams.get(key);
  // Derive the live value from the URL. Memoized on the raw string so a parse
  // that builds objects stays referentially stable between unrelated renders.
  const value = React.useMemo<T>(() => {
    const parsed = parse(raw);
    return parsed === undefined || parsed === null ? fallback : parsed;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw]);

  // Keep the freshest derived value in a ref so the updater form of setValue can
  // read "prev" without making the callback depend on (and re-create with) value.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Coalesce rapid writes: stash the pending next value, flush once after the
  // debounce window. The latest write within the window is the one that lands.
  const pendingRef = React.useRef<string | null | undefined>(undefined);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = React.useCallback(() => {
    if (pendingRef.current === undefined) return;
    const nextRaw = pendingRef.current;
    pendingRef.current = undefined;

    const params = new URLSearchParams(searchParams.toString());
    if (nextRaw === null) params.delete(key);
    else params.set(key, nextRaw);

    const qs = params.toString();
    // scroll:false keeps the page anchored; replace (not push) means a drag does
    // not bury Back under a hundred entries. A discrete change still rewinds one
    // step because the parsed value differs from the prior render.
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, pathname, router, searchParams]);

  const write = React.useCallback(
    (nextRaw: string | null) => {
      pendingRef.current = nextRaw;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        flush();
      }, WRITE_DEBOUNCE_MS);
    },
    [flush],
  );

  const setValue = React.useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === "function"
          ? (next as (prev: T) => T)(valueRef.current)
          : next;
      write(serialize(resolved));
    },
    [serialize, write],
  );

  const reset = React.useCallback(() => {
    write(null);
  }, [write]);

  // Drop a pending timer on unmount so a late flush never fires post-teardown.
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return [value, setValue, reset] as const;
}

/** One slot's config for {@link useUrlStateMap}. */
export type UrlStateField<T> = {
  parse: Parse<T>;
  serialize: Serialize<T>;
  fallback: T;
};

/** The shape useUrlStateMap returns: the live values, a typed patch setter, and
 *  a reset that clears every managed key at once. */
export type UrlStateMap<S extends Record<string, unknown>> = {
  values: S;
  /** Patch one or more keys in a single URL write (one history step). */
  set: (patch: Partial<S>) => void;
  /** Clear every managed key (back to each field's fallback). */
  reset: () => void;
};

/**
 * Multiple URL-state slots written together. Use this when several controls
 * share a re-derivation (e.g. a calculator with tip + wage + rent) so a change
 * to two of them lands as ONE coalesced URL write, not two competing ones.
 *
 * @param fields a map of key -> { parse, serialize, fallback }.
 *
 * The returned `set` merges a partial patch over the current values and writes
 * the whole managed key-set at once (debounced). Keys serializing to null are
 * removed. Other query keys on the URL are left untouched.
 */
export function useUrlStateMap<S extends Record<string, unknown>>(fields: {
  [K in keyof S]: UrlStateField<S[K]>;
}): UrlStateMap<S> {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawKey = searchParams.toString();

  const values = React.useMemo<S>(() => {
    const out = {} as S;
    for (const k in fields) {
      const f = fields[k];
      const parsed = f.parse(searchParams.get(k));
      out[k] = parsed === undefined || parsed === null ? f.fallback : parsed;
    }
    return out;
    // Re-derive only when the query string changes. `fields` is treated as
    // stable config (declared inline once per render is fine: rawKey gates it).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawKey]);

  const valuesRef = React.useRef(values);
  valuesRef.current = values;

  const pendingRef = React.useRef<Partial<S> | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = React.useCallback(() => {
    const patch = pendingRef.current;
    pendingRef.current = null;
    if (!patch) return;

    const params = new URLSearchParams(searchParams.toString());
    const merged = { ...valuesRef.current, ...patch } as S;
    for (const k in fields) {
      const f = fields[k];
      const s = f.serialize(merged[k]);
      if (s === null) params.delete(k);
      else params.set(k, s);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, router, searchParams]);

  const set = React.useCallback(
    (patch: Partial<S>) => {
      pendingRef.current = { ...(pendingRef.current ?? {}), ...patch };
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        flush();
      }, WRITE_DEBOUNCE_MS);
    },
    [flush],
  );

  const reset = React.useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    for (const k in fields) params.delete(k);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, router, searchParams]);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { values, set, reset };
}
