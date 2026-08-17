"use client";

/**
 * WatchTray - the floating "watch list" dock, plus the AddToWatch button cards
 * use to put items into it.
 *
 * THE AGENCY GRAMMAR (P1-P5):
 *   P1 (act in place): adding from a card flips that card's button in place and
 *       the tray count ticks up. No navigation, no reload.
 *   P2 (right tempo): everything here is a cheap client write (localStorage), so
 *       it lands instantly (<100ms). No Apply, no spinner, no pending shell.
 *   P3 (reversible, shareable): removing offers an undo; the durable list lives
 *       in localStorage (the per-view URL is the share); and "Compare these"
 *       hands the watched cells straight to /compare via the same ?q= the
 *       compare grid reads.
 *   P4 (oriented): the dock always shows the count ("Watching N"), and each row
 *       carries its label + sub so the reader knows what they kept.
 *   P5 (disclosed not displayed): the dock rests as a single quiet pill in the
 *       corner and only expands to the list on intent. It hides entirely when
 *       the list is empty (nothing to watch yet, nothing to show).
 *
 * NOT glass yet (Phase B adds the warm glass frame). Solid token surfaces, AA
 * contrast, 44px targets, reduced-motion honored. Tokens only, no raw hex/px/ms,
 * no em-dashes, no source-agency names.
 *
 * The lead mounts <WatchTray /> once in the root layout (next wave). AddToWatch
 * is placed on cards. Both are self-contained: they read the store directly.
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  useWatchList,
  buildCompareHref,
  type WatchInput,
  type WatchItem,
  type WatchKind,
} from "@/lib/watch_store";

/* ================================================================== */
/* Icons (inline, currentColor, aria-hidden).                          */
/* ================================================================== */

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 2.5h8a.5.5 0 0 1 .5.5v10.5L8 11l-4.5 2.5V3a.5.5 0 0 1 .5-.5Z" />
    </svg>
  );
}

function BookmarkFilledIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <path d="M4 2.5h8a.5.5 0 0 1 .5.5v10.5a.5.5 0 0 1-.74.44L8 11.57l-3.76 2.37A.5.5 0 0 1 3.5 13.5V3a.5.5 0 0 1 .5-.5Z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

function CompareIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 2v12M3 5l-1.5 2.5h3L3 5ZM13 5l-1.5 2.5h3L13 5ZM3 11.5h2.5M10.5 11.5H13" />
    </svg>
  );
}

/* ================================================================== */
/* Shared focus ring (the house interactive ring).                     */
/* ================================================================== */

const RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2";

/** A tiny token-colored dot keyed to the item kind, a quiet second read on the
 *  kind label printed beside it. City was moss-500 until 2026-08-17, which is
 *  banned; the three kinds now separate on the terracotta-to-ink ladder rather
 *  than on three hues, and the LABEL is what actually names the kind. */
function KindDot({ kind }: { kind: WatchKind }) {
  const tone =
    kind === "cell"
      ? "bg-atlas-500"
      : kind === "city"
        ? "bg-cocoa-500"
        : "bg-ink-900";
  return <span aria-hidden="true" className={cn("h-1.5 w-1.5 shrink-0 rounded-full", tone)} />;
}

function kindLabel(kind: WatchKind): string {
  return kind === "cell" ? "Business" : kind === "city" ? "Place" : "Activity";
}

/* ================================================================== */
/* AddToWatch - the per-card add/remove button.                        */
/* ================================================================== */

export type AddToWatchProps = {
  /** The item this card represents. addedAt is stamped by the store. */
  item: WatchInput;
  /** "button" is the standalone pill; "inline" is a compact text+icon affordance
   *  that sits in a card's action row. */
  variant?: "button" | "inline";
  className?: string;
};

/**
 * AddToWatch - a card drops this on itself to let the reader keep the item.
 *
 * Optimistic (P1/P2): the click toggles the store synchronously, so the label
 * flips ("Watch" -> "Watching") with no wait. Removing surfaces a brief inline
 * "Undo" (P3) that restores the exact item. Idle until hydration so the server
 * render and first client render agree (always shows "Watch" pre-hydration).
 */
export function AddToWatch({ item, variant = "button", className }: AddToWatchProps) {
  const { add, remove, restore, has, hydrated } = useWatchList();
  const watching = hydrated && has(item.kind, item.slug);

  // Hold the just-removed item briefly so "Undo" can put it back verbatim.
  const [undoItem, setUndoItem] = React.useState<WatchItem | null>(null);
  const undoTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (undoTimer.current) clearTimeout(undoTimer.current);
    };
  }, []);

  function clearUndoSoon() {
    if (undoTimer.current) clearTimeout(undoTimer.current);
    // 6s is plenty to catch a misclick without lingering. Plain timer math,
    // not a style token, so a literal here is fine.
    undoTimer.current = setTimeout(() => setUndoItem(null), 6000);
  }

  function onToggle() {
    if (watching) {
      const snapshot: WatchItem = { ...item, addedAt: Date.now() };
      remove(item.kind, item.slug);
      setUndoItem(snapshot);
      clearUndoSoon();
    } else {
      add(item);
      setUndoItem(null);
    }
  }

  function onUndo() {
    if (!undoItem) return;
    restore(undoItem);
    setUndoItem(null);
    if (undoTimer.current) clearTimeout(undoTimer.current);
  }

  const label = watching ? "Watching" : "Watch";

  if (variant === "inline") {
    return (
      <span className={cn("inline-flex items-center gap-2", className)}>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={watching}
          className={cn(
            "inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors",
            RING,
            watching
              ? "text-atlas-700 hover:text-atlas-900"
              : "text-cocoa-700 hover:text-ink-900",
          )}
        >
          {watching ? (
            <BookmarkFilledIcon className="h-3.5 w-3.5" />
          ) : (
            <BookmarkIcon className="h-3.5 w-3.5" />
          )}
          {label}
        </button>
        {undoItem ? (
          <button
            type="button"
            onClick={onUndo}
            className={cn(
              "inline-flex min-h-[44px] items-center rounded-full px-2 text-xs font-medium text-cocoa-700 underline decoration-cream-400 underline-offset-2 hover:text-ink-900",
              RING,
            )}
          >
            Undo
          </button>
        ) : null}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={watching}
        className={cn(
          "inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors",
          RING,
          watching
            ? "border-atlas-300 bg-atlas-50 text-atlas-700 hover:bg-atlas-100"
            : "border-parchment bg-white text-cocoa-700 hover:bg-cream-100 hover:text-ink-900",
        )}
      >
        {watching ? (
          <BookmarkFilledIcon className="h-4 w-4" />
        ) : (
          <BookmarkIcon className="h-4 w-4" />
        )}
        {label}
      </button>
      {undoItem ? (
        <button
          type="button"
          onClick={onUndo}
          className={cn(
            "inline-flex min-h-[44px] items-center rounded-full px-2 text-xs font-medium text-cocoa-700 underline decoration-cream-400 underline-offset-2 hover:text-ink-900",
            RING,
          )}
        >
          Undo
        </button>
      ) : null}
    </span>
  );
}

/* ================================================================== */
/* WatchTray - the floating dock.                                      */
/* ================================================================== */

export type WatchTrayProps = {
  /** Corner to dock in. Default bottom-right. */
  align?: "left" | "right";
  className?: string;
};

export function WatchTray({ align = "right", className }: WatchTrayProps) {
  const { items, count, hydrated, remove, restore, clear } = useWatchList();
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const pillRef = React.useRef<HTMLButtonElement | null>(null);

  // A single pending undo for a removed row (P3), restored verbatim.
  const [undoItem, setUndoItem] = React.useState<WatchItem | null>(null);
  const undoTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (undoTimer.current) clearTimeout(undoTimer.current);
    };
  }, []);

  // Close on Escape and on an outside click, the expected dismissal grammar for
  // a disclosed surface (P5). Focus returns to the pill on Escape.
  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        pillRef.current?.focus();
      }
    }
    function onClick(e: MouseEvent) {
      const t = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(t) &&
        pillRef.current &&
        !pillRef.current.contains(t)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  // Nothing to watch yet: render nothing (P5). Also keeps SSR + first paint
  // identical (server is empty, so it renders nothing too) until hydration adds
  // the dock once a real list exists.
  if (!hydrated || count === 0) return null;

  function onRemove(it: WatchItem) {
    remove(it.kind, it.slug);
    setUndoItem(it);
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setUndoItem(null), 6000);
  }

  function onUndo() {
    if (!undoItem) return;
    restore(undoItem);
    setUndoItem(null);
    if (undoTimer.current) clearTimeout(undoTimer.current);
  }

  const compareHref = buildCompareHref(items);
  const side = align === "left" ? "left-4" : "right-4";
  const panelSide = align === "left" ? "left-0" : "right-0";

  return (
    <div
      className={cn(
        "fixed bottom-4 z-overlay print:hidden",
        side,
        className,
      )}
    >
      {/* The expanded list, anchored above the pill. */}
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Your watch list"
          className={cn(
            "absolute bottom-full mb-3 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-parchment bg-white shadow-lift",
            "motion-safe:animate-ds-slide-up",
            panelSide,
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-parchment px-4 py-3">
            <div className="text-sm font-semibold text-ink-900">
              Watching{" "}
              <span className="tabular-nums text-cocoa-700">{count}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => clear()}
                className={cn(
                  "inline-flex min-h-[44px] items-center rounded-full px-2.5 text-xs font-medium text-cocoa-700 hover:text-ink-900",
                  RING,
                )}
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  pillRef.current?.focus();
                }}
                aria-label="Close watch list"
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-full text-cocoa-700 hover:text-ink-900",
                  RING,
                )}
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Rows */}
          <ul className="max-h-[min(60vh,24rem)] divide-y divide-parchment overflow-y-auto">
            {items.map((it) => (
              <li
                key={`${it.kind}:${it.slug}`}
                className="flex items-start gap-3 px-4 py-3"
              >
                <a
                  href={it.href}
                  className={cn(
                    "group min-w-0 flex-1 rounded-md",
                    RING,
                  )}
                >
                  <div className="flex items-center gap-2">
                    <KindDot kind={it.kind} />
                    <span className="truncate text-sm font-medium text-ink-900 group-hover:text-atlas-700">
                      {it.label}
                    </span>
                  </div>
                  <div className="mt-0.5 pl-3.5 text-xs text-cocoa-500">
                    {it.sub ? `${kindLabel(it.kind)} · ${it.sub}` : kindLabel(it.kind)}
                  </div>
                </a>
                <button
                  type="button"
                  onClick={() => onRemove(it)}
                  aria-label={`Remove ${it.label} from watch list`}
                  className={cn(
                    "grid h-11 w-11 shrink-0 place-items-center rounded-full text-cocoa-500 hover:text-ink-900",
                    RING,
                  )}
                >
                  <CloseIcon className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>

          {/* Footer: undo + compare */}
          <div className="border-t border-parchment px-4 py-3">
            {undoItem ? (
              <div className="mb-2 flex items-center justify-between gap-3 text-xs text-cocoa-700">
                <span>Removed {undoItem.label}</span>
                <button
                  type="button"
                  onClick={onUndo}
                  className={cn(
                    "inline-flex min-h-[44px] items-center rounded-full px-2 font-medium text-atlas-700 underline decoration-cream-400 underline-offset-2 hover:text-atlas-900",
                    RING,
                  )}
                >
                  Undo
                </button>
              </div>
            ) : null}
            {compareHref ? (
              <a
                href={compareHref}
                className={cn(
                  "inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-atlas-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-atlas-700",
                  RING,
                )}
              >
                <CompareIcon className="h-4 w-4" />
                Compare these
              </a>
            ) : (
              <p className="text-xs leading-relaxed text-cocoa-500">
                Watch a few businesses to line them up side by side.
              </p>
            )}
          </div>
        </div>
      ) : null}

      {/* The resting pill (P5): one quiet affordance until opened. */}
      <button
        ref={pillRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`Watch list, ${count} ${count === 1 ? "item" : "items"}`}
        className={cn(
          "inline-flex min-h-[44px] items-center gap-2 rounded-full border border-parchment bg-white pl-4 pr-3 text-sm font-semibold text-ink-900 shadow-card transition-colors hover:bg-cream-100",
          RING,
        )}
      >
        <BookmarkFilledIcon className="h-4 w-4 text-atlas-500" />
        <span>Watching</span>
        <span className="grid min-h-[1.5rem] min-w-[1.5rem] place-items-center rounded-full bg-atlas-500 px-1.5 text-xs font-bold tabular-nums text-white">
          {count}
        </span>
      </button>
    </div>
  );
}
