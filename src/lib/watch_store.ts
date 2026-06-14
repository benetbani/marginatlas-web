"use client";

/**
 * watch_store - the durable, cross-view "watch list" (shortlist) the reader
 * builds as they move around the Atlas.
 *
 * THE DIVISION OF LABOR (agency principle P3, two halves):
 *   - The URL is the per-VIEW share: the exact slider/venue/zoom state of the
 *     page you are looking at right now (see lib/url_state). Copy the address
 *     bar, send it, the other person lands on the same view.
 *   - localStorage is the durable LIST: the small set of cells/cities/industries
 *     the reader flagged to come back to. It outlives navigation, survives a
 *     reload, and is the thing the floating watch tray and /you read from.
 *
 * Design notes:
 *   - SSR-safe: every read is guarded for `window`; the hook seeds empty on the
 *     server and the first client render, then hydrates from storage in an
 *     effect (no hydration-mismatch: server and first client render agree on []).
 *   - Optimistic + in-sync: writes update storage AND broadcast a same-tab event
 *     plus the native cross-tab `storage` event, so the tray, a card's add
 *     button, and /you all reflect the same list the instant it changes.
 *   - Capped: a shortlist, not a database. Adding past the cap drops the oldest
 *     entry (FIFO) so the tray stays glanceable.
 *
 * Tokens-free, UI-free. No em-dashes, no source-agency names.
 */
import * as React from "react";

/** What can be watched. A cell is the deepest (trade x place); city + industry
 *  are the broader coordinates a reader might also want to keep an eye on. */
export type WatchKind = "cell" | "city" | "industry";

export type WatchItem = {
  kind: WatchKind;
  /** Stable identity within a kind (usually the page slug or cell key). */
  slug: string;
  /** What the row shows (e.g. "Italian restaurant, London"). */
  label: string;
  /** Where the row links (the canonical page for this item). */
  href: string;
  /** Optional second line (e.g. "City level" or "Typical EUR 240k"). */
  sub?: string;
  /** For cells: the coordinates the /compare share link needs. Lets the tray
   *  hand a watched cell straight into the comparison grid. */
  compare?: { country: string; industry: string; region: string };
  /** When it was added (ms epoch). Used for FIFO eviction + recency sort. */
  addedAt: number;
};

/** The shape a caller passes to {@link addToWatch}. addedAt is stamped here. */
export type WatchInput = Omit<WatchItem, "addedAt">;

/** A shortlist, not a database: keep the tray glanceable. */
export const WATCH_CAP = 12;

const STORAGE_KEY = "atlas:watch:v1";
/** Same-tab broadcast channel (the native `storage` event only fires in OTHER
 *  tabs, so we dispatch our own for the component that triggered the write). */
const SYNC_EVENT = "atlas:watch:changed";

/** A stable identity key for an item (kind + slug), so add is idempotent and
 *  remove can target a single row. */
export function watchKey(kind: WatchKind, slug: string): string {
  return `${kind}:${slug}`;
}

/* ------------------------------------------------------------------ */
/* Storage plumbing (all SSR-guarded).                                 */
/* ------------------------------------------------------------------ */

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readStorage(): WatchItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Defensive: drop anything that does not look like a WatchItem so one bad
    // legacy entry never crashes the tray.
    return parsed.filter(isWatchItem);
  } catch {
    return [];
  }
}

function isWatchItem(v: unknown): v is WatchItem {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    (o.kind === "cell" || o.kind === "city" || o.kind === "industry") &&
    typeof o.slug === "string" &&
    typeof o.label === "string" &&
    typeof o.href === "string"
  );
}

function writeStorage(items: WatchItem[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full / disabled (private mode). The in-memory list still drives
    // the current session; we just cannot persist. Fail soft, never throw.
  }
  // Tell every listener in THIS tab (the storage event does not self-fire).
  try {
    window.dispatchEvent(new CustomEvent(SYNC_EVENT));
  } catch {
    /* no-op */
  }
}

/* ------------------------------------------------------------------ */
/* Imperative API (usable outside React, e.g. an analytics hook).      */
/* ------------------------------------------------------------------ */

/** Read the current list (newest first). SSR-safe (returns [] on the server). */
export function getWatchList(): WatchItem[] {
  return sortNewestFirst(readStorage());
}

function sortNewestFirst(items: WatchItem[]): WatchItem[] {
  return [...items].sort((a, b) => b.addedAt - a.addedAt);
}

/**
 * Add (or refresh) an item. Idempotent on (kind, slug): re-adding an existing
 * item updates its fields and bumps it to newest. Enforces the cap by evicting
 * the oldest. Returns the new list.
 */
export function addToWatch(input: WatchInput): WatchItem[] {
  const next: WatchItem = { ...input, addedAt: Date.now() };
  const key = watchKey(next.kind, next.slug);
  const current = readStorage().filter(
    (it) => watchKey(it.kind, it.slug) !== key,
  );
  let merged = [...current, next];
  // Cap by dropping the oldest (smallest addedAt) until within bounds.
  if (merged.length > WATCH_CAP) {
    merged = sortNewestFirst(merged).slice(0, WATCH_CAP);
  }
  writeStorage(merged);
  return sortNewestFirst(merged);
}

/** Remove one item by (kind, slug). Returns the new list. */
export function removeFromWatch(kind: WatchKind, slug: string): WatchItem[] {
  const key = watchKey(kind, slug);
  const next = readStorage().filter(
    (it) => watchKey(it.kind, it.slug) !== key,
  );
  writeStorage(next);
  return sortNewestFirst(next);
}

/** Restore a previously removed item verbatim (for undo: keeps its addedAt so
 *  it lands back in its original recency slot). Returns the new list. */
export function restoreToWatch(item: WatchItem): WatchItem[] {
  const key = watchKey(item.kind, item.slug);
  const current = readStorage().filter(
    (it) => watchKey(it.kind, it.slug) !== key,
  );
  let merged = [...current, item];
  if (merged.length > WATCH_CAP) {
    merged = sortNewestFirst(merged).slice(0, WATCH_CAP);
  }
  writeStorage(merged);
  return sortNewestFirst(merged);
}

/** Clear the entire list. Returns []. */
export function clearWatch(): WatchItem[] {
  writeStorage([]);
  return [];
}

/** Is this item currently watched? SSR-safe. */
export function isWatched(kind: WatchKind, slug: string): boolean {
  const key = watchKey(kind, slug);
  return readStorage().some((it) => watchKey(it.kind, it.slug) === key);
}

/* ------------------------------------------------------------------ */
/* React hook.                                                         */
/* ------------------------------------------------------------------ */

export type UseWatchList = {
  /** The watched items, newest first. Empty on the server + first client paint. */
  items: WatchItem[];
  /** Count, for the tray pill ("Watching N"). */
  count: number;
  /** True once the client has read storage (so callers can hold honest empty
   *  states until the real list is known, avoiding a flash of "nothing"). */
  hydrated: boolean;
  add: (input: WatchInput) => void;
  remove: (kind: WatchKind, slug: string) => void;
  /** Put a removed item back exactly where it was (undo). */
  restore: (item: WatchItem) => void;
  clear: () => void;
  has: (kind: WatchKind, slug: string) => boolean;
};

/**
 * useWatchList - subscribe to the durable watch list.
 *
 * Every mounted consumer (the tray, each card's add button, /you) shares one
 * source of truth: writes broadcast SYNC_EVENT (same tab) and the browser fires
 * `storage` (other tabs), and both refresh every hook instance. So toggling a
 * card's button updates the tray count with no prop drilling and no context.
 */
export function useWatchList(): UseWatchList {
  const [items, setItems] = React.useState<WatchItem[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  const refresh = React.useCallback(() => {
    setItems(getWatchList());
  }, []);

  React.useEffect(() => {
    // Hydrate from storage after mount (server rendered []), then subscribe.
    refresh();
    setHydrated(true);

    const onLocal = () => refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) refresh();
    };
    window.addEventListener(SYNC_EVENT, onLocal);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(SYNC_EVENT, onLocal);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  const add = React.useCallback((input: WatchInput) => {
    // Optimistic: update local state immediately, persistence + broadcast follow
    // synchronously inside addToWatch (which re-broadcasts to other instances).
    setItems(addToWatch(input));
  }, []);

  const remove = React.useCallback((kind: WatchKind, slug: string) => {
    setItems(removeFromWatch(kind, slug));
  }, []);

  const restore = React.useCallback((item: WatchItem) => {
    setItems(restoreToWatch(item));
  }, []);

  const clear = React.useCallback(() => {
    setItems(clearWatch());
  }, []);

  const has = React.useCallback(
    (kind: WatchKind, slug: string) =>
      items.some((it) => it.kind === kind && it.slug === slug),
    [items],
  );

  return {
    items,
    count: items.length,
    hydrated,
    add,
    remove,
    restore,
    clear,
    has,
  };
}

/* ------------------------------------------------------------------ */
/* Compare hand-off.                                                   */
/* ------------------------------------------------------------------ */

/**
 * Build the /compare share URL from a set of watched cells. The compare grid
 * reads a `?q=` param: a URL-encoded JSON array of exactly three
 * { country, industry, region } slots. We take up to three watched cells that
 * carry compare coordinates, pad to three with the trailing slot repeated (the
 * grid needs three), and encode them the same way the compare page writes them.
 *
 * Items without compare coordinates (cities, industries, older cell entries)
 * are skipped. Returns null when no watched cell can seed a comparison.
 */
export function buildCompareHref(items: WatchItem[]): string | null {
  const slots = items
    .filter((it) => it.kind === "cell" && it.compare)
    .map((it) => it.compare!)
    .slice(0, 3);
  if (slots.length === 0) return null;
  // The compare grid expects three slots. Repeat the last to fill, so a 1- or
  // 2-cell shortlist still lands on a valid grid (the reader edits from there).
  while (slots.length < 3) slots.push(slots[slots.length - 1]);
  const q = encodeURIComponent(JSON.stringify(slots));
  return `/compare?q=${q}`;
}
