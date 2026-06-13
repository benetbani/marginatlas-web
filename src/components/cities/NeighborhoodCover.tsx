/**
 * NeighborhoodCover — an honest placeholder cover for a neighborhood
 * (Fable, 2026-06-13). The founder asked for an image on each neighborhood;
 * the brand forbids passing a generic photo off as a specific real place, so
 * this is a DESIGNED cover, not a photo: a warm token gradient chosen
 * deterministically from the neighborhood, an engraved street-grid motif over
 * it (the cartographic thread), and the neighborhood's initial set large and
 * faint. It fills the blank now; a curated photo can replace it later via the
 * city-data pipeline without touching call sites.
 *
 * Tokens only, no raw hex outside the token reads, decorative (aria-hidden).
 */
import { colors } from "@/lib/design-tokens";

// Warm gradient pairs, all from the token ramps. The neighborhood seed picks
// one deterministically so the same place always reads the same.
const GRADIENTS: ReadonlyArray<readonly [string, string]> = [
  [colors.atlas[700], colors.atlas[400]],
  [colors.cocoa[700], colors.cocoa[300]],
  [colors.moss[700], colors.moss[400]],
  [colors.ink[700], colors.ink[500]],
  [colors.amber[700], colors.amber[400]],
  [colors.teal[700], colors.teal[500]],
  [colors.clay[700], colors.clay[400]],
];

function seedIndex(seed: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0x7fffffff;
  return h % mod;
}

export function NeighborhoodCover({
  name,
  seed,
  className = "h-20",
}: {
  /** Display name; its initial is set large and faint as the only mark. */
  name: string;
  /** Stable key (e.g. `${citySlug}-${neighborhoodSlug}`) that picks the gradient. */
  seed: string;
  /** Height utility (default h-20). The cover is always full width. */
  className?: string;
}) {
  const [from, to] = GRADIENTS[seedIndex(seed, GRADIENTS.length)];
  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-hidden ${className}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
    >
      {/* Engraved street-grid motif (the cartographic thread), faint over the wash. */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-soft-light"
        style={{
          backgroundImage: "url('/atlas-grid.svg')",
          backgroundSize: "30px 30px",
        }}
      />
      <span className="pointer-events-none absolute -bottom-3 right-2 select-none font-display text-6xl font-semibold leading-none text-cream-50/25">
        {name.trim().charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
