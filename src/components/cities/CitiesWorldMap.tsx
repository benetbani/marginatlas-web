/**
 * CitiesWorldMap (Cities §1 founder revision)
 * ============================================
 *
 * Full-bleed geographic map for /cities. Renders every covered city as
 * a small terracotta marker at its real lat/lon, on a neutral base.
 *
 * Cities §1 hard targets (master prompt 2026-05-25):
 *   1.1 marker r = 2.5 at zoom 1 (way smaller than the prior r=4)
 *   1.2 vermillion fill (atlas-700 #952509), stroke atlas-800 #6F1A06
 *   1.3 hover bumps to r=5 with a 14px transparent halo for click target
 *   1.4 zoom in / zoom out buttons; wheel zoom enabled
 *   1.5 zoom range 1x to 4x; pan clamped within bounds
 *   1.6 tooltip floats DIRECTLY BELOW the hovered dot, not in the corner
 *   1.7 "Click a city" instruction at top-center, light gray, opacity-60,
 *       disappears on first user interaction
 *   1.8 countries are not clickable (pointer-events: none on Geography)
 *
 * Hero revision (founder escalation 2026-06-14): the map is now the dominant
 * hero element at the very top of /cities, so two things move into the first
 * viewport. The zoom +/- controls sit TOP-RIGHT (they used to be ~660px down
 * at the bottom of a 600px map, below the fold); and the first-paint height is
 * trimmed (h-[360px] md:h-[480px]) so the whole hero (compact copy + map +
 * visible controls) lands on a standard first screen. Markers, the tooltip,
 * wheel zoom, and pan clamping are unchanged. The height is overridable via the
 * optional heightClassName prop so the page owns its hero sizing.
 */

"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { colors as tokenColors, elevation } from "@/lib/design-tokens";

export type CitiesWorldMapCity = {
  slug: string;
  name: string;
  iso2: string;
  lat: number;
  lon: number;
};

type Props = {
  cities: CitiesWorldMapCity[];
  /**
   * Tailwind sizing utilities for the map frame, letting the host page own its
   * hero sizing.
   *
   * DEFAULTS TO AN ASPECT RATIO, NOT A HEIGHT, and that is a fix rather than a
   * preference. A fixed height cannot match the map's own 1100:480 ratio at
   * more than one viewport width, and an SVG at `preserveAspectRatio` meet
   * letterboxes the difference as dead white inside the card. At 1440 the old
   * `h-[480px]` frame was 1022 wide, so it letterboxed 34px; at 375 it was 287
   * wide inside an `h-[360px]` frame and letterboxed 235px, two thirds of the
   * card being nothing at all. Matching the ratio makes that zero at every
   * width.
   */
  heightClassName?: string;
};

/* Atlas palette, read from the tokens rather than pasted as hex, so this map
   cannot drift from the ramp the rest of the site draws with.
   Founder direction 2026-05-26: continents render very light so the editorial
   markers (cities, hover state) pop.

   THE BORDERS ARE WHY THE MAP WAS NOT VISIBLE. This map filled the land with
   cream-200 and outlined it with cream-400 at 0.5, which is a 1.1:1 step off
   the white card underneath: 177 country paths covering 72% of the canvas, and
   nothing to see but the dots. Its sibling WorldMapPicker had already been
   corrected for exactly this, in the founder's own words, "the borders between
   countries should be pronounced. Right now, they don't exist", and draws the
   same land with an ink-700 outline at 0.9. Two maps, one problem, one answer
   already ratified: this one now matches it. */
/* Land fill: `parchment`, a TRUE NEUTRAL at s=0%. Not `ink[100]`, which is
   #f0e7d9 and reads as warm sand: tried, photographed, and the whole map came
   out the colour the founder banned. Not `cream[200]` either, whose value is
   fine (#eeeeee, also neutral now) but whose name is the one the purge is
   removing. */
const GEO_FILL = tokenColors.parchment; //      very light neutral land
const GEO_STROKE = tokenColors.ink[700]; //     pronounced country borders
const GEO_STROKE_WIDTH = 0.9;

/* ANTARCTICA IS NOT DRAWN, and dropping it is the whole reason the rest of the
   world got 20% bigger. Measured in a browser at 1440x900: the 176 inhabited
   countries occupied y 114..439 of a 480px frame, and the only thing filling
   the bottom was a 466x26 sliver of Antarctica clipped flat by the frame edge,
   which reads as a rendering fault rather than a continent. It carries no city
   in this atlas and never will. `id` is the ISO 3166-1 numeric code, which is
   how world-atlas keys its features. */
const ANTARCTICA_ID = "010";

/* The projection is FITTED, not guessed. Previously scale 175 on a 1100x600
   frame, which left the land occupying 72% of the width and 68% of the height:
   141px of dead white down each side and 114px across the top, at 1440. These
   two numbers come from d3's own fitExtent over the 176 inhabited countries
   inset by 14 units, converted to the (scale, center) pair react-simple-maps
   exposes, since it hard-wires translate to [width/2, height/2] and offers no
   way to set it. Land now spans x 35..1065 and y 14..466 of the 1100x480 frame.
   Recompute with scratch/fit_map.mjs if the frame ever changes. */
const MAP_WIDTH = 1100;
const MAP_HEIGHT = 480;
const PROJECTION_SCALE = 193.81;
const PROJECTION_CENTER: [number, number] = [0, 6.886];
const MARKER_FILL = tokenColors.atlas[700]; //  vermillion
const MARKER_STROKE = tokenColors.atlas[800]; // deeper vermillion
const TOOLTIP_BG = tokenColors.white;
const TOOLTIP_BORDER = tokenColors.paper[400];
const TOOLTIP_TEXT = tokenColors.ink[900];

/* Served from public/, not unpkg.
   This fetched https://unpkg.com/world-atlas@2/countries-110m.json at runtime,
   from every reader's browser, while the identical file sat in node_modules:
   world-atlas is already a dependency of this project ("^2.0.2"). So the map
   downloaded from a third-party CDN data the build already had.

   Two things wrong with that. The map stops drawing if unpkg is slow or down,
   for no reason we control. And "@2" is a floating major, so the geometry could
   change under the site without a commit.

   Copied to public/geo/ from node_modules at the version in the lockfile. */
const GEO_URL = "/geo/countries-110m.json";

type GeoFeature = {
  rsmKey: string;
  id?: string | number;
  properties: { name?: string };
};

type HoverState = {
  slug: string;
  name: string;
  iso2: string;
  lon: number;
  lat: number;
} | null;

type ZoomPos = { coordinates: [number, number]; zoom: number };

/* THE ZOOM GROUP MUST START ON THE PROJECTION'S OWN CENTRE, or the fit above is
   undone at runtime. useZoomPan translates the map by
   `height/2 - projection(center).y`, so any centre other than the projected one
   is a second, opposing offset applied on top of the first. It was [0, 20],
   which was right while the projection sat at [0, 0]; against the fitted centre
   it pushed the whole world 47px down and clipped the southern tip of South
   America against the frame. Measured in a browser, not reasoned about. */
const INITIAL_POS: ZoomPos = { coordinates: PROJECTION_CENTER, zoom: 1 };

function iso2ToFlag(iso2: string): string {
  if (!iso2 || iso2.length !== 2) return "";
  const upper = iso2.toUpperCase();
  const a = upper.charCodeAt(0);
  const b = upper.charCodeAt(1);
  if (a < 65 || a > 90 || b < 65 || b > 90) return "";
  return String.fromCodePoint(0x1f1e6 + (a - 65), 0x1f1e6 + (b - 65));
}

export default function CitiesWorldMap({
  cities,
  heightClassName = "aspect-[1100/480]",
}: Props) {
  const [hovered, setHovered] = useState<HoverState>(null);
  const [pos, setPos] = useState<ZoomPos>(INITIAL_POS);
  const [interacted, setInteracted] = useState(false);

  const sorted = useMemo(
    () => [...cities].sort((a, b) => a.slug.localeCompare(b.slug)),
    [cities],
  );

  const markFirstInteraction = useCallback(() => {
    if (!interacted) setInteracted(true);
  }, [interacted]);

  // Cities §1.5: zoom range 1 to 4. Pan clamping is done in onMoveEnd
  // by re-centering if the user drags the map off the equator/prime
  // meridian beyond a reasonable budget for the current zoom level.
  const handleMoveEnd = useCallback((nextPos: ZoomPos) => {
    markFirstInteraction();
    const clamped: ZoomPos = {
      zoom: Math.min(4, Math.max(1, nextPos.zoom)),
      coordinates: [
        Math.min(180, Math.max(-180, nextPos.coordinates[0])),
        Math.min(75, Math.max(-55, nextPos.coordinates[1])),
      ],
    };
    setPos(clamped);
  }, [markFirstInteraction]);

  const handleZoomIn = useCallback(() => {
    markFirstInteraction();
    setPos((p) => ({ ...p, zoom: Math.min(4, p.zoom * 1.5) }));
  }, [markFirstInteraction]);

  const handleZoomOut = useCallback(() => {
    markFirstInteraction();
    setPos((p) => ({ ...p, zoom: Math.max(1, p.zoom / 1.5) }));
  }, [markFirstInteraction]);

  // Marker radius scales inversely with zoom so dots stay visually
  // small at every zoom level. At zoom 4 they are r=0.625.
  const baseRadius = 2.5 / pos.zoom;
  const hoverRadius = 5 / pos.zoom;
  const haloRadius = 14 / pos.zoom;
  // Stroke width also scales so a 1px halo at zoom 1 is still ~0.25px
  // at zoom 4 (browser ceil keeps it visible).
  const markerStroke = 0.8 / pos.zoom;

  // Founder direction 2026-05-26: match the homepage map exactly.
  // Atlas paper pattern behind the continents, same border, same 6px
  // radius. No bg-cream-100 (was visually different from the homepage).
  return (
    <div
      className={`relative w-full ${heightClassName} rounded-md overflow-hidden border border-ink-200 atlas-paper`}
      aria-label="World map showing covered cities"
      role="region"
    >
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{
          scale: PROJECTION_SCALE,
          center: PROJECTION_CENTER,
        }}
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <ZoomableGroup
          zoom={pos.zoom}
          center={pos.coordinates}
          onMoveEnd={handleMoveEnd}
          minZoom={1}
          maxZoom={4}
          /* 2026-05-26: clamp pan to the SVG viewport. d3-zoom
             enforces this DURING the drag, so the user cannot
             physically move continents past the map's edge.
             At zoom=1 the extent equals the view (no pan); at
             zoom>1 the user pans within the visible globe only. */
          translateExtent={[
            [0, 0],
            [MAP_WIDTH, MAP_HEIGHT],
          ]}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: GeoFeature[] }) =>
              geographies
                .filter((geo) => String(geo.id) !== ANTARCTICA_ID)
                .map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    // Cities §1.8: countries not clickable. The map's
                    // semantic affordance is the city dot, never the
                    // country shape.
                    style={{
                      default: {
                        fill: GEO_FILL,
                        stroke: GEO_STROKE,
                        strokeWidth: GEO_STROKE_WIDTH,
                        outline: "none",
                        vectorEffect: "non-scaling-stroke",
                        pointerEvents: "none",
                      },
                      hover: {
                        fill: GEO_FILL,
                        stroke: GEO_STROKE,
                        strokeWidth: GEO_STROKE_WIDTH,
                        outline: "none",
                        vectorEffect: "non-scaling-stroke",
                        pointerEvents: "none",
                      },
                      pressed: {
                        fill: GEO_FILL,
                        outline: "none",
                        pointerEvents: "none",
                      },
                    }}
                  />
                ))
            }
          </Geographies>

          {sorted.map((city) => {
            const isHovered = hovered?.slug === city.slug;
            return (
              <Marker key={city.slug} coordinates={[city.lon, city.lat]}>
                <a
                  href={`/cities/${city.slug}`}
                  aria-label={`${city.name}, ${city.iso2}`}
                  onMouseEnter={() => {
                    markFirstInteraction();
                    setHovered({
                      slug: city.slug,
                      name: city.name,
                      iso2: city.iso2,
                      lon: city.lon,
                      lat: city.lat,
                    });
                  }}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() =>
                    setHovered({
                      slug: city.slug,
                      name: city.name,
                      iso2: city.iso2,
                      lon: city.lon,
                      lat: city.lat,
                    })
                  }
                  onBlur={() => setHovered(null)}
                >
                  <circle
                    r={haloRadius}
                    fill="transparent"
                    style={{ cursor: "pointer", pointerEvents: "all" }}
                  />
                  <circle
                    r={isHovered ? hoverRadius : baseRadius}
                    fill={MARKER_FILL}
                    stroke={MARKER_STROKE}
                    strokeWidth={markerStroke}
                    style={{
                      transition: "r 120ms ease-out",
                      pointerEvents: "none",
                    }}
                  />
                </a>
              </Marker>
            );
          })}

          {/* Cities §1.6: tooltip floats DIRECTLY BELOW the hovered dot.
              Rendered as a sibling Marker so react-simple-maps projects
              it to the same screen position as the dot, then offset
              downward by ~12 SVG units (scales with zoom). */}
          {hovered && (
            <Marker coordinates={[hovered.lon, hovered.lat]}>
              <g style={{ pointerEvents: "none" }}>
                <foreignObject
                  x={-90}
                  y={hoverRadius + 4 / pos.zoom}
                  width={180}
                  height={32}
                  style={{ overflow: "visible" }}
                >
                  <div
                    style={{
                      background: TOOLTIP_BG,
                      color: TOOLTIP_TEXT,
                      border: `1px solid ${TOOLTIP_BORDER}`,
                      borderRadius: 6,
                      padding: "4px 8px",
                      fontSize: 12,
                      fontWeight: 600,
                      textAlign: "center",
                      boxShadow: elevation.subtle,
                      whiteSpace: "nowrap",
                      display: "inline-block",
                      transformOrigin: "top center",
                      transform: `scale(${1 / pos.zoom})`,
                    }}
                  >
                    <span aria-hidden="true" style={{ marginRight: 4 }}>
                      {iso2ToFlag(hovered.iso2)}
                    </span>
                    {hovered.name}
                  </div>
                </foreignObject>
              </g>
            </Marker>
          )}
        </ZoomableGroup>
      </ComposableMap>

      {/* Cities §1.7: the "Click a city" instruction, still top-left and still
          gone on first interaction.

          IT NOW SITS ON A CHIP, because the map underneath it changed. It was
          set at 45% opacity directly on the frame, which worked only while the
          top-left corner was empty ocean: the projection wasted 141px down each
          side and 114px across the top, so the words had a white field to
          themselves. Now that the world fills the frame those same words land
          on Alaska and the Aleutians, faint grey type on grey land, which is
          both unreadable and dirties the picture. A small card-surface chip
          gives it its own ground, so it reads at full strength and the map
          reads underneath it. */}
      {!interacted && (
        <div
          aria-hidden="true"
          /* HIDDEN BELOW md, and that is honesty rather than tidiness.
             Photographed at 375: the frame is 285x124, which puts 252 markers
             at 0.63px across and makes "click a city" an instruction no
             thumb can follow. The chip also covered North America, a quarter
             of the picture, to say so. Above md the frame is 1022 wide, the
             markers are 4.6px, and the instruction is true. On a phone the
             map is a coverage picture and the search box directly beneath it
             is the way in. */
          className="pointer-events-none absolute top-3 left-3 hidden rounded-md bg-white/90 px-2.5 py-1 font-display text-base tracking-wide text-cocoa-500 md:block md:text-lg"
        >
          Click a city
        </div>
      )}

      {/* Cities §1.4 (hero revision): zoom controls moved to the TOP-RIGHT so
          they always sit inside the first viewport. Atlas palette, 32px square,
          stacked vertically; tappable target floor met at 375px. */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={handleZoomIn}
          aria-label="Zoom in"
          className="w-8 h-8 inline-flex items-center justify-center rounded-md bg-white border border-parchment text-ink-900 hover:bg-paper-100 transition shadow-sm text-base font-semibold"
        >
          +
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          aria-label="Zoom out"
          className="w-8 h-8 inline-flex items-center justify-center rounded-md bg-white border border-parchment text-ink-900 hover:bg-paper-100 transition shadow-sm text-base font-semibold"
        >
          &minus;
        </button>
      </div>
    </div>
  );
}
