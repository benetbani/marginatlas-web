/**
 * CitiesWorldMap (v34 sanity sweep, section 2)
 * =============================================
 *
 * Full-bleed geographic map for /cities. Renders every covered city as
 * a marker at its real lat/lon, on a cream base with the atlas palette.
 *
 * Built on react-simple-maps (already a project dep, same lib used by
 * WorldMapPicker on the homepage) so palette and projection stay
 * consistent with the rest of the site. No third-party tile layer, no
 * Mapbox/Leaflet, no blue Mercator default.
 *
 * Sizing per master sanity prompt targets 2.1, 2.2, 2.3:
 *   desktop: full width inside max-w-7xl, 600 px tall
 *   mobile:  full width, 320 px tall
 *
 * Markers per master sanity prompt targets 2.4, 2.5, 2.6, 2.7:
 *   one circle per city, atlas-700 fill with atlas-800 stroke
 *   wrapped in an anchor to /cities/{slug}
 *   hover bumps radius and reveals a tooltip with name plus flag emoji
 */

"use client";

import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
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

// Atlas palette tokens, exact hex values per the v34 sanity sweep prompt.
// Cream base for land, parchment border for country outlines, atlas teal
// for the city markers. Kept inline because react-simple-maps takes
// style props, not class names.
const GEO_FILL = "#F5F0E6";
const GEO_STROKE = "#B2A48A";
const MARKER_FILL = "#16AEB5";
const MARKER_STROKE = "#0F8A8F";
const TOOLTIP_BG = "#0A2540";
const TOOLTIP_TEXT = "#FFFFFF";

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
} | null;

// Build a regional indicator emoji from an ISO 3166-1 alpha-2 code.
// Two regional indicator letters (U+1F1E6 plus offset) render as the
// country flag on every modern OS. Returns empty string on bad input.
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

  // Stable order so React reconciliation is predictable across rerenders.
  const sorted = useMemo(
    () => [...cities].sort((a, b) => a.slug.localeCompare(b.slug)),
    [cities],
  );

  return (
    <div
      className="relative w-full h-[320px] md:h-[600px] rounded-xl overflow-hidden border border-parchment bg-cream-100"
      aria-label="World map showing 200 covered cities"
      role="region"
    >
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 175 }}
        width={1100}
        height={600}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }: { geographies: GeoFeature[] }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: {
                    fill: GEO_FILL,
                    stroke: GEO_STROKE,
                    strokeWidth: 0.5,
                    outline: "none",
                    vectorEffect: "non-scaling-stroke",
                  },
                  hover: {
                    fill: GEO_FILL,
                    stroke: GEO_STROKE,
                    strokeWidth: 0.5,
                    outline: "none",
                    vectorEffect: "non-scaling-stroke",
                  },
                  pressed: {
                    fill: GEO_FILL,
                    outline: "none",
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
                onMouseEnter={() =>
                  setHovered({ slug: city.slug, name: city.name, iso2: city.iso2 })
                }
                onMouseLeave={() => setHovered(null)}
                onFocus={() =>
                  setHovered({ slug: city.slug, name: city.name, iso2: city.iso2 })
                }
                onBlur={() => setHovered(null)}
              >
                {/* Transparent halo widens the click and hover target
                    to roughly 32 px without distorting the visual. */}
                <circle
                  r={16}
                  fill="transparent"
                  style={{ cursor: "pointer", pointerEvents: "all" }}
                />
                <circle
                  r={isHovered ? 7 : 4}
                  fill={MARKER_FILL}
                  stroke={MARKER_STROKE}
                  strokeWidth={1.5}
                  style={{
                    transition: "r 120ms ease-out",
                    pointerEvents: "none",
                  }}
                />
              </a>
            </Marker>
          );
        })}
      </ComposableMap>

      {hovered && (
        <div
          className="pointer-events-none absolute top-3 left-3 text-sm font-medium rounded-md px-3 py-1.5 shadow-md"
          style={{ background: TOOLTIP_BG, color: TOOLTIP_TEXT }}
          role="status"
          aria-live="polite"
        >
          <span aria-hidden="true" style={{ marginRight: 6 }}>
            {iso2ToFlag(hovered.iso2)}
          </span>
          {hovered.name}
        </div>
      )}
    </div>
  );
}
