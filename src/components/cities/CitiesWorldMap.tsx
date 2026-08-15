/**
 * CitiesWorldMap (Cities §1 founder revision)
 * ============================================
 *
 * Full-bleed geographic map for /cities. Renders every covered city as
 * a small terracotta marker at its real lat/lon, on a cream base.
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
   * Tailwind height utilities for the map frame, letting the host page own its
   * hero sizing. Defaults to a trimmed first-screen height so the controls and
   * hero copy share one viewport. Mobile-first: must stay legible at 375px.
   */
  heightClassName?: string;
};

// Atlas palette. Founder direction 2026-05-26: continents render in
// very light gray across all maps so the editorial markers (cities,
// hover state) pop. Unified to ECECEC with both the homepage
// WorldMapPicker for visual consistency.
// Conformed to design-tokens 2026-06-12: warm cream continents, live
// atlas marker values, warm ink tooltip text (the cool navy is banned).
const GEO_FILL = "#efeeeb"; //   cream-200, very light warm
const GEO_STROKE = "#c3bfb7"; // cream-400 border
const MARKER_FILL = "#991600"; // atlas-700, vermillion
const MARKER_STROKE = "#701000"; // atlas-800, deeper vermillion
const TOOLTIP_BG = "#ffffff"; //  cream-50
const TOOLTIP_BORDER = "#c3bfb7"; // cream-400
const TOOLTIP_TEXT = "#211810"; // ink-900

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

const INITIAL_POS: ZoomPos = { coordinates: [0, 20], zoom: 1 };

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
  heightClassName = "h-[360px] md:h-[480px]",
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
        projectionConfig={{ scale: 175 }}
        width={1100}
        height={600}
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
            [1100, 600],
          ]}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: GeoFeature[] }) =>
              geographies.map((geo) => (
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
                      strokeWidth: 0.5,
                      outline: "none",
                      vectorEffect: "non-scaling-stroke",
                      pointerEvents: "none",
                    },
                    hover: {
                      fill: GEO_FILL,
                      stroke: GEO_STROKE,
                      strokeWidth: 0.5,
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
                      boxShadow: "0 2px 6px rgba(10, 37, 64, 0.18)",
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

      {/* Cities §1.7: faint "Click a city" instruction. Moved to the top-LEFT
          on the hero revision so it never collides with the zoom controls that
          now sit top-right. Disappears on first user interaction. */}
      {!interacted && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-3 left-4 font-display text-lg md:text-xl tracking-wide text-ink-700"
          style={{ opacity: 0.45 }}
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
          className="w-8 h-8 inline-flex items-center justify-center rounded-md bg-cream-50 border border-parchment text-ink-900 hover:bg-cream-100 transition shadow-sm text-base font-semibold"
        >
          +
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          aria-label="Zoom out"
          className="w-8 h-8 inline-flex items-center justify-center rounded-md bg-cream-50 border border-parchment text-ink-900 hover:bg-cream-100 transition shadow-sm text-base font-semibold"
        >
          &minus;
        </button>
      </div>
    </div>
  );
}
