/**
 * LoadingSkeleton (page-layout high-level skeleton)
 * =================================================
 *
 * Calm loading placeholders for full page sections. Composes the
 * canonical `ui/skeleton` primitive into the four canonical layouts
 * Atlas uses during data fetch:
 *
 *   - cell-page-hero  : matches DenseCellHero
 *   - card-grid       : 3x2 card grid (PeerCells fallback)
 *   - list            : 6-row table (RolePay fallback)
 *   - single-block    : one rounded block (generic chart fallback)
 *
 * Container is role="status" + aria-live="polite" so screen readers
 * announce the wait once, not per shape.
 *
 * Design system Phase 2 refactor, 2026-05-27. Public API unchanged;
 * the internal shape primitives now come from ui/skeleton so any
 * future token change (animation timing, base color) propagates
 * here automatically.
 */
import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export type LoadingSkeletonVariant =
  | "cell-page-hero"
  | "card-grid"
  | "list"
  | "single-block";

export type LoadingSkeletonProps = {
  variant: LoadingSkeletonVariant;
  className?: string;
  /** Optional label for screen readers. Defaults to "Loading". */
  srLabel?: string;
};

// Wrapper that lets callers in this file size a Skeleton by inline
// width/height (in px) without changing the underlying primitive's API.
function Bar({
  w = "100%",
  h = 12,
  className,
  rounded,
}: {
  w?: string | number;
  h?: number;
  className?: string;
  rounded?: "full" | "default";
}) {
  return (
    <Skeleton
      variant="text"
      width={w}
      height={h}
      className={`${rounded === "full" ? "rounded-full" : ""} ${className ?? ""}`.trim()}
    />
  );
}

function Block({ h = 120, className }: { h?: number; className?: string }) {
  return <Skeleton variant="block" height={h} className={`w-full ${className ?? ""}`.trim()} />;
}

export default function LoadingSkeleton({
  variant,
  className,
  srLabel = "Loading",
}: LoadingSkeletonProps) {
  return (
    <div role="status" aria-live="polite" className={`w-full ${className ?? ""}`}>
      <span className="sr-only">{srLabel}</span>

      {variant === "cell-page-hero" && (
        <div className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
          <div className="flex items-center justify-between gap-4">
            <Bar w="220px" h={14} />
            <Bar w="100px" h={20} rounded="full" />
          </div>
          <div className="mt-6 space-y-3">
            <Bar w="80%" h={36} />
            <Bar w="55%" h={36} />
          </div>
          <Bar w="40%" h={14} className="mt-5" />

          <div className="mt-10 grid grid-cols-12 gap-8 items-end">
            <div className="col-span-7 space-y-3">
              <Bar w="160px" h={12} />
              <Bar w="60%" h={84} />
            </div>
            <div className="col-span-5 space-y-3">
              <div className="flex items-end justify-between gap-4">
                <Bar w="22%" h={28} />
                <Bar w="22%" h={28} />
                <Bar w="22%" h={28} />
              </div>
              <Bar w="100%" h={24} rounded="full" />
            </div>
          </div>

          <div className="mt-8 h-px bg-parchment opacity-70" aria-hidden="true" />
          <div className="mt-5 flex flex-wrap gap-3">
            <Bar w="120px" h={14} />
            <Bar w="140px" h={14} />
            <Bar w="120px" h={14} />
            <Bar w="120px" h={14} />
          </div>
        </div>
      )}

      {variant === "card-grid" && (
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-parchment bg-cream-50 p-5 space-y-3"
              >
                <div className="flex items-baseline justify-between">
                  <Bar w="40%" h={10} />
                  <Bar w="22%" h={10} />
                </div>
                <Bar w="65%" h={22} />
                <Bar w="50%" h={14} />
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <Bar h={28} />
                  <Bar h={28} />
                  <Bar h={28} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {variant === "list" && (
        <div className="mx-auto max-w-6xl px-6">
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-4 items-center py-3 border-b border-parchment last:border-b-0"
              >
                <div className="col-span-3">
                  <Bar w="80%" h={14} />
                </div>
                <div className="col-span-1">
                  <Bar w="40%" h={14} />
                </div>
                <div className="col-span-5">
                  <Bar h={10} rounded="full" />
                </div>
                <div className="col-span-2">
                  <Bar w="55%" h={14} className="ml-auto" />
                </div>
                <div className="col-span-1">
                  <Bar w="55%" h={14} className="ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {variant === "single-block" && (
        <div className="mx-auto max-w-6xl px-6">
          <Block h={240} />
        </div>
      )}
    </div>
  );
}
