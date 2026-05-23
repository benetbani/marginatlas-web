/**
 * LoadingSkeleton
 * ===============
 *
 * Calm loading placeholders for Atlas pages. Cream and parchment shapes
 * pulsing at a slow 1.8s cycle. No spinners, no progress bars.
 *
 * Variants:
 *   - cell-page-hero  : matches DenseCellHero
 *   - card-grid       : 3x2 card grid (PeerCells fallback)
 *   - list            : 6-row table (RolePay fallback)
 *   - single-block    : one rounded block (generic chart fallback)
 *
 * Container is role="status" + aria-live="polite", with sr-only "Loading"
 * text so screen readers announce the wait.
 */

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

const PULSE = "animate-[atlasPulse_1800ms_ease-in-out_infinite]";

/* The pulse keyframes live in tailwind.config.ts:
     keyframes: { atlasPulse: { "0%,100%": { opacity: "0.55" }, "50%": { opacity: "0.85" } } }
   If you'd rather not add a token, swap `PULSE` to `animate-pulse opacity-70`.
*/

function Bar({ w = "100%", h = 12, className = "" }: { w?: string; h?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block rounded ${PULSE} ${className}`}
      style={{ width: w, height: h, background: "#F4EAD5" }}
    />
  );
}
function Block({ h = 120, className = "" }: { h?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block w-full rounded-lg ${PULSE} ${className}`}
      style={{ height: h, background: "#F4EAD5" }}
    />
  );
}

export default function LoadingSkeleton({
  variant,
  className,
  srLabel = "Loading",
}: LoadingSkeletonProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-full ${className ?? ""}`}
    >
      <span className="sr-only">{srLabel}</span>

      {variant === "cell-page-hero" && (
        <div className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
          <div className="flex items-center justify-between gap-4">
            <Bar w="220px" h={14} />
            <Bar w="100px" h={20} className="rounded-full" />
          </div>
          <div className="mt-6 space-y-3">
            <Bar w="80%" h={36} />
            <Bar w="55%" h={36} />
          </div>
          <Bar w="40%" h={14} className="mt-5" />

          <div className="mt-10 grid grid-cols-12 gap-8 items-end">
            <div className="col-span-7 space-y-3">
              <Bar w="160px" h={12} />
              <Bar w="60%"  h={84} />
            </div>
            <div className="col-span-5 space-y-3">
              <div className="flex items-end justify-between gap-4">
                <Bar w="22%" h={28} />
                <Bar w="22%" h={28} />
                <Bar w="22%" h={28} />
              </div>
              <Bar w="100%" h={24} className="rounded-full" />
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
                <div className="col-span-3"><Bar w="80%" h={14} /></div>
                <div className="col-span-1"><Bar w="40%" h={14} /></div>
                <div className="col-span-5"><Bar h={10} className="rounded-full" /></div>
                <div className="col-span-2"><Bar w="55%" h={14} className="ml-auto" /></div>
                <div className="col-span-1"><Bar w="55%" h={14} className="ml-auto" /></div>
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
