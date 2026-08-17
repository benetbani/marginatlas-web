/**
 * NeighborhoodCover — a designed cartographic cover for a neighborhood
 * (Fable, 2026-06-14). The founder forbids passing a generic photo off as a
 * specific real place, so this is a DESIGNED cover, not a photo. The earlier
 * version drew a single giant faint initial bottom-right; a row of those read
 * as spaced giant letters ("C O N S E") and looked like a broken placeholder.
 *
 * This redesign reads as an intentional, on-brand map fragment:
 *   1. a warm token gradient, picked deterministically from the seed so each
 *      district differs but the same place is always identical;
 *   2. a quiet cartographic motif drawn inline and seeded from the name —
 *      flowing contour lines + a faint route + a small rosette mark — so no two
 *      neighbourhoods share the same lines (a generated map snippet, not a
 *      repeated tile);
 *   3. the engraved street-grid token texture underneath for the paper thread;
 *   4. the neighbourhood name as a SMALL, legible label (Fraunces, bottom-left)
 *      sitting on a soft dark scrim that guarantees AA contrast over any of the
 *      gradient pairs.
 *
 * It is composed to read well at the h-20 city-grid tile AND the h-28/h-40
 * neighbourhood-page banner: the motif and label scale with container-query-
 * free, size-agnostic units (svg is preserveAspectRatio-sliced; the label uses
 * a fluid clamp), and the scrim keeps the label legible at every size.
 *
 * A curated photo can replace this later via the city-data pipeline without
 * touching call sites. Tokens only, no raw hex outside the token reads.
 */
import { colors } from "@/lib/design-tokens";

/**
 * Gradient pairs, all from the token ramps. The seed picks one
 * deterministically so the same place always reads the same. [from, to] runs
 * dark -> light along the diagonal; the bottom scrim re-darkens for the label.
 *
 * THREE OF THE SEVEN WERE BANNED HUES over two passes, and this is the purest
 * form of the case the founder ruled on: a green cover, an amber cover and a
 * second green under the name teal, carrying no meaning whatever, chosen by a
 * hash of the district name. Decoration is exactly where "terracotta plus cool
 * neutrals, no exceptions" bites hardest, because there is not even a signal to
 * trade away.
 *
 * THE SEVENTH SLOT IS GONE, 2026-08-17, and the earlier pass's instinct to hold
 * the count at seven is overturned here on evidence rather than taste. The teal
 * pair measured h 150 and h 149, which is green; teal sits near 180. Four
 * replacements were drawn at tile size and looked at rather than argued about:
 *
 *   paper 400/200   meanY 68.8   the only truly cool option, and among six
 *                                saturated tiles it reads as an unloaded image
 *   ink 800/300     meanY 25.3   indistinguishable from cocoa 700/300 below
 *   cocoa 900/500   meanY  9.8   indistinguishable from ink 700/500 below
 *   atlas 600/300   meanY 25.1   separable, but it makes four reds to two browns
 *
 * None earns a slot. The palette holds SIX separable covers and no more, and six
 * that separate beat seven where one is a near-duplicate of its neighbour.
 *
 * SEPARATION IS BY DEPTH AND VALUE, NOT BY HUE, because the ratified palette
 * does not hold six hues either and pretending otherwise is how a green and an
 * amber got in. Measured, there are exactly two hue families here: terracotta
 * and clay at h 4-10, and cocoa and ink at h 28-35. The earlier header called
 * ink "neutral" and that was wrong: ink 700 is h 32 s 30%, cocoa 700 is h 30
 * s 26%, the same warm brown.
 *
 * SO THE ORDER IS LOAD-BEARING. The array alternates family AND value on every
 * step, because `spreadCoverIndexes` below hands adjacent tiles CONSECUTIVE
 * indices, so index n and index n+1 are the pair most often seen side by side:
 *
 *   0  atlas 700/400   red    meanY 15.9
 *   1  ink   900/600   brown  meanY  4.5
 *   2  clay  700/400   red    meanY  8.6
 *   3  cocoa 700/300   brown  meanY 26.1
 *   4  atlas 900/600   red    meanY  6.9
 *   5  ink   700/500   brown  meanY 10.0
 *
 * The old order put ink 700/500 at index 3 and ink 900/600 at index 4, the two
 * closest pairs in the whole set, adjacent.
 *
 * The scrim below is unaffected, it is ink-900 at 80%, and the lightest end in
 * the set is still cocoa 300 exactly as before, so no label's AA margin moves.
 *
 * verify_palette_membership never counted any of the three. It reads hex
 * literals, rgb() literals and the class names moss/amber/orange/teal; these
 * were property reads off the token object, which is none of the three.
 */
const GRADIENTS: ReadonlyArray<readonly [string, string]> = [
  [colors.atlas[700], colors.atlas[400]],
  [colors.ink[900], colors.ink[600]],
  [colors.clay[700], colors.clay[400]],
  [colors.cocoa[700], colors.cocoa[300]],
  [colors.atlas[900], colors.atlas[600]],
  [colors.ink[700], colors.ink[500]],
];

/** Stable 31-base string hash, masked positive. */
function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0x7fffffff;
  return h;
}

/**
 * SPREAD A ROW OF COVERS SO NO TWO OF THEM DRAW THE SAME RAMP.
 *
 * THIS IS THE DEFECT THAT ACTUALLY SHOWS, and it is not a palette defect. On
 * /cities/london at 1440 the four featured tiles rendered, measured off the
 * emitted markup rather than guessed:
 *
 *   City of London   #211810 -> #5d4d3b
 *   West End         #211810 -> #5d4d3b     <- byte-identical to the one before
 *   South Bank       #5c1813 -> #b3463a
 *   East London      #463726 -> #7d6c58
 *
 * Two of four were the SAME PAIR. Nothing about the palette caused that: a hash
 * over a small set collides, and with four draws from seven buckets a collision
 * is likelier than not. Widening the palette would not have fixed it and the
 * palette has nowhere to widen to.
 *
 * The precedent is `spreadCovers` in src/app/page.tsx, which hit exactly this on
 * the homepage blog rail and fixed it by moving a repeat onto the next unused
 * ramp rather than by adding colours. Same move here, with one difference: the
 * seed also drives the cartographic motif, so this returns an INDEX rather than
 * a rewritten seed. The lines a district gets stay its own; only which ramp it
 * lands on moves. That keeps "the same place always reads the same" true of the
 * drawing, and makes it true of the colour only within a given row, which is the
 * same trade the blog rail makes.
 *
 * Deterministic: no randomness, no time, and it returns the natural index for
 * every seed when nothing collides. Callers with a single cover do not need it
 * (the neighbourhood page banner draws one, so it has no neighbour to clash
 * with); callers rendering a ROW do.
 *
 * More seeds than ramps: the run past the sixth falls back to its natural index
 * rather than inventing a seventh, which is the same choice `spreadCovers` makes
 * when it runs out of pool.
 */
export function spreadCoverIndexes(seeds: readonly string[]): number[] {
  const used = new Set<number>();
  return seeds.map((seed) => {
    const natural = hash(seed) % GRADIENTS.length;
    if (!used.has(natural)) {
      used.add(natural);
      return natural;
    }
    for (let step = 1; step < GRADIENTS.length; step++) {
      const next = (natural + step) % GRADIENTS.length;
      if (!used.has(next)) {
        used.add(next);
        return next;
      }
    }
    return natural;
  });
}

/** Small deterministic PRNG (mulberry32) seeded from the hash, for the motif. */
function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Build the cartographic motif as inline SVG paths on a 0..100 x 0..56 board
 * (the slice viewBox). Seeded so each neighbourhood gets its own contour set,
 * route, and rosette placement. All strokes are white and faint;
 * the warm-frame-clean-data law does not apply here (this is decoration, never
 * sits behind a number).
 */
function buildMotif(seed: number) {
  const rng = makeRng(seed);
  const W = 100;
  const H = 56;

  // 3 nested contour rings, organic blobs sharing a drifting centre — reads as
  // a topographic snippet. Each ring is a closed cubic loop with jittered radii.
  const cx = 30 + rng() * 45;
  const cy = 14 + rng() * 30;
  const contours: string[] = [];
  const ringCount = 3;
  for (let r = 0; r < ringCount; r++) {
    const base = 9 + r * 9;
    const pts = 7;
    const coords: Array<[number, number]> = [];
    for (let i = 0; i < pts; i++) {
      const ang = (i / pts) * Math.PI * 2;
      const rad = base * (0.8 + rng() * 0.4);
      coords.push([cx + Math.cos(ang) * rad * 1.15, cy + Math.sin(ang) * rad]);
    }
    // Smooth closed path through the points (Catmull-Rom -> cubic Bézier).
    let d = `M ${coords[0][0].toFixed(1)} ${coords[0][1].toFixed(1)}`;
    for (let i = 0; i < pts; i++) {
      const p0 = coords[(i - 1 + pts) % pts];
      const p1 = coords[i];
      const p2 = coords[(i + 1) % pts];
      const p3 = coords[(i + 2) % pts];
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    contours.push(d + " Z");
  }

  // One drifting "route" line crossing the board (a road / river thread).
  const ry = 8 + rng() * 40;
  const route = `M -4 ${ry.toFixed(1)} C ${(W * 0.3).toFixed(1)} ${(ry + (rng() - 0.5) * 28).toFixed(1)}, ${(W * 0.65).toFixed(1)} ${(ry + (rng() - 0.5) * 28).toFixed(1)}, ${(W + 4).toFixed(1)} ${(8 + rng() * 40).toFixed(1)}`;

  return { contours, route, rosette: { x: cx, y: cy } };
}

export function NeighborhoodCover({
  name,
  seed,
  className = "h-20",
  showLabel = true,
  coverIndex,
}: {
  /** Display name; set as a small legible label, bottom-left. */
  name: string;
  /** Stable key (e.g. `${citySlug}-${neighborhoodSlug}`) that seeds the cover. */
  seed: string;
  /** Height utility (default h-20). The cover is always full width. */
  className?: string;
  /**
   * Draw the name inside the cover. TURN THIS OFF WHEN THE CALLER ALREADY
   * PRINTS THE NAME. Seen at 1440 on /cities/london: the four neighbourhood
   * tiles each read "City of London" white-on-dark inside the cover and then
   * "City of London" again in the card body 12px below it, because this
   * component labels itself and the tile labels it too. Four tiles, both
   * labels, on every city page. The card body keeps its copy: the cover is
   * `aria-hidden`, so it is the body text that gives the link its accessible
   * name, and the body copy is the one that hovers with the link.
   */
  showLabel?: boolean;
  /**
   * Which gradient to draw, overriding the seed's own. Pass the matching entry
   * from `spreadCoverIndexes` when rendering a ROW of covers, so two districts
   * whose names happen to hash into the same bucket do not draw the same tile
   * side by side. Omit it for a lone cover. Out-of-range values wrap rather than
   * throw, because a cover that fails to paint is a blank rectangle with no
   * error anywhere.
   */
  coverIndex?: number;
}) {
  const h = hash(seed);
  const pick =
    coverIndex === undefined
      ? h % GRADIENTS.length
      : ((coverIndex % GRADIENTS.length) + GRADIENTS.length) % GRADIENTS.length;
  const [from, to] = GRADIENTS[pick];
  const { contours, route, rosette } = buildMotif(h);
  const stroke = colors.white;

  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-hidden ${className}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
    >
      {/* Paper thread: the engraved street-grid token texture, very faint. */}
      <div
        className="absolute inset-0 opacity-[0.14] mix-blend-soft-light"
        style={{ backgroundImage: "url('/atlas-grid.svg')", backgroundSize: "26px 26px" }}
      />

      {/* Seeded cartographic motif: contour rings + a route + a rosette mark.
          Sliced to fill any aspect ratio so it composes at tile and banner. */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 56"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        focusable="false"
      >
        {contours.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke={stroke}
            strokeWidth={0.6}
            strokeOpacity={0.16 + i * 0.05}
          />
        ))}
        <path d={route} stroke={stroke} strokeWidth={0.8} strokeOpacity={0.22} strokeLinecap="round" />
        {/* Compass rosette diamond + tick, the cartographic signature. */}
        <g
          transform={`translate(${rosette.x.toFixed(1)} ${rosette.y.toFixed(1)})`}
          stroke={stroke}
          strokeOpacity={0.5}
          strokeWidth={0.5}
        >
          <path d="M0 -3 L1 0 L0 3 L-1 0 Z" fill={stroke} fillOpacity={0.32} />
          <circle r="4.4" strokeOpacity={0.28} />
        </g>
      </svg>

      {/* Soft scrim rising from the bottom: guarantees the label clears AA over
          any gradient pair (the lighter pairs would otherwise wash the label). */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3"
        style={{ backgroundImage: `linear-gradient(to top, ${colors.ink[900]}cc 0%, ${colors.ink[900]}00 100%)` }}
      />

      {/* The name as a small, composed label, not a watermark. Fraunces, warm
          white, bottom-left. Fluid size keeps it proportionate from tile to
          banner without horizontal overflow at 375px. */}
      {showLabel ? (
        <span
          className="pointer-events-none absolute bottom-1.5 left-2.5 right-2.5 select-none truncate font-display font-semibold leading-tight tracking-tight text-white"
          style={{ fontSize: "clamp(0.8125rem, 1.4vw + 0.55rem, 1.125rem)" }}
        >
          {name.trim()}
        </span>
      ) : null}
    </div>
  );
}
