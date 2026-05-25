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
 *   1.4 zoom in / zoom out buttons in bottom-right; wheel zoom enabled
 *   1.5 zoom range 1x to 4x; pan clamped within bounds
 *   1.6 tooltip floats DIRECTLY BELOW the hovered dot, not in the corner
 *   1.7 "Click a city" instruction at top-center, light gray, opacity-60,
 *       disappears on first user interaction
 *   1.8 countries are not clickable (pointer-events: none on Geography)
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
};

// Atlas palette. The codebase's actual atlas-700 token is vermillion,
// NOT teal. Founder asked for the signature terracotta color so we use
// the real atlas tokens here.
const GEO_FILL = "#F5F0E6";        // cream-100, the page-background tone
const GEO_STROKE = "#B2A48A";      // parchment border
const MARKER_FILL = "#952509";     // atlas-700, vermillion
const MARKER_STROKE = "#6F1A06";   // atlas-800, deeper vermillion
const TOOLTIP_BG = "#FFFFFF";
const TOOLTIP_BORDER = "#B2A48A";
const TOOLTIP_TEXT = "#0A2540";

const GEO_URL = "https://unpkg.com/world-atlas@2/countries-110m.json";

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

export default function CitiesWorldMap({ cities }: Props) {
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

  return (
    <div
      className="relative w-full h-[320px] md:h-[600px] rounded-xl overflow-hidden border border-parchment bg-cream-100"
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

      {/* Cities §1.7: faint "Click a city" instruction at top-center.
          Disappears on first user interaction (hover, pan, or zoom). */}
      {!interacted && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 font-display text-xl md:text-2xl tracking-wide text-ink-700"
          style={{ opacity: 0.45 }}
        >
          Click a city
        </div>
      )}

      {/* Cities §1.4: zoom controls in the bottom-right corner. Atlas
          palette, 32px square, stacked vertically. */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
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
