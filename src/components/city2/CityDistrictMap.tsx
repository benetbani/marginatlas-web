"use client";
/**
 * CityDistrictMap , the districts of a city, coloured by how well off they are.
 *
 * Ratified 2026-07-31, decision 17: "Map v1: districts coloured by ONE measure,
 * tap a district for its detail. Not five toggleable layers yet." This is that,
 * and the one measure is the resident wealth band, because "which neighbourhood
 * is richer" was the question that started the whole mechanism.
 *
 * A POINT, NOT A POLYGON, AND THAT IS THE HONEST CHOICE. The contract says so at
 * CityDistrictPoint: we hold no district boundaries, and a blob of the wrong
 * shape is a claim about where a neighbourhood ends, which is contested in every
 * city on earth. The point sits on the commercial core rather than the
 * geographic centroid, because the centroid of an oddly shaped district lands in
 * a park or a rail yard, somewhere no business could open.
 *
 * FIVE STEPS, NOT A GRADIENT. The data is five bands and the ramp has five
 * stops. A continuous gradient would imply a precision the bands exist to deny:
 * the whole reason wealth ships as bands is that ~84% of income variance sits
 * inside a small area, so an interpolated colour would be inventing detail the
 * research says is not there.
 *
 * THE RAMP IS NEUTRAL TO TERRACOTTA, which is the site's only accent. Terracotta
 * marks the top band because terracotta marks the answer everywhere else on the
 * site; the other four are the cool neutral ramp already in the stylesheet. No
 * second hue, and no red-to-green, which would also read as good-to-bad and this
 * scale is not a judgment.
 *
 * NO API KEY. Carto Positron raster, no-label variant, three subdomains given
 * explicitly, so our labels are the only labels. Google Maps was ruled out
 * because it bills per map load, which is a cost that grows exactly as the site
 * succeeds.
 *
 * SSR-safe: the server renders a sized box, the map boots in an effect, and it
 * tears down on unmount. A reader with no JavaScript, or a crawler, gets the
 * district list below it, which carries every fact the map does.
 */
import * as React from "react";
/* The stylesheet is a static import, matching SpineMap, because a CSS import
   cannot be awaited. Only the library itself is dynamic, which is what keeps
   maplibre out of the server bundle and off the wire for a reader who never
   reaches this chapter. */
import "maplibre-gl/dist/maplibre-gl.css";

export type DistrictPin = {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  /** The raw band. Null renders an outline pin: located, not yet read. */
  band: "well-above" | "above" | "around" | "below" | "well-below" | null;
  /** The plain-words band, for the popup. */
  bandLabel: string | null;
  /** Rent against the city rate, e.g. "1.4x". */
  rent: string | null;
};

/**
 * Five stops for five bands, named as the stylesheet's own tokens rather than
 * copied out of it as hex.
 *
 * A marker is a real DOM element, so it can read a custom property at runtime
 * and the palette keeps ONE home. Hardcoding the values here would put the ramp
 * in two places, and the two would drift the first time the palette moved,
 * which is the most expensive defect class this project has.
 */
const BAND_TOKEN: Record<NonNullable<DistrictPin["band"]>, string> = {
  "well-below": "--n4",
  below: "--n3",
  around: "--n2",
  above: "--terra-bright",
  "well-above": "--terra",
};

/** Resolve the ramp against the mounted container, which is inside `.av2` where
 *  the tokens are declared. Falls back to the token reference itself, so a
 *  missing token shows as an unstyled marker rather than an invented colour. */
function readRamp(el: HTMLElement): Record<string, string> {
  const cs = getComputedStyle(el);
  const out: Record<string, string> = {};
  for (const [band, token] of Object.entries(BAND_TOKEN)) {
    out[band] = cs.getPropertyValue(token).trim() || `var(${token})`;
  }
  return out;
}

/** Ordered poorest to richest, so the legend reads as a scale rather than a
 *  list. The order is the data's, not an opinion about it. */
const BAND_ORDER: Array<NonNullable<DistrictPin["band"]>> = [
  "well-below",
  "below",
  "around",
  "above",
  "well-above",
];

const BAND_SHORT: Record<NonNullable<DistrictPin["band"]>, string> = {
  "well-below": "Well below",
  below: "Below",
  around: "Around",
  above: "Above",
  "well-above": "Well above",
};

export function CityDistrictMap({
  pins,
  cityName,
}: {
  pins: DistrictPin[];
  cityName: string;
}) {
  const holder = React.useRef<HTMLDivElement | null>(null);
  const started = React.useRef(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    if (started.current || holder.current == null || pins.length === 0) return;
    started.current = true;
    let map: { remove: () => void } | null = null;
    let cancelled = false;

    /* Imported dynamically so maplibre never reaches the server bundle and a
       reader who never scrolls here never downloads it. */
    void (async () => {
      try {
        const maplibregl = (await import("maplibre-gl")).default;
        if (cancelled || holder.current == null) return;

        const ramp = readRamp(holder.current);

        /* Bounds are computed BEFORE construction and handed to the
           constructor, not applied afterwards with fitBounds. Calling
           fitBounds immediately after `new Map` runs while the container is
           still being measured, and the fit silently does nothing: the first
           render showed the entire globe with all six London pins stacked in
           one spot. Only looking at it caught that. */
        const bounds = new maplibregl.LngLatBounds();
        for (const p of pins) bounds.extend([p.lng, p.lat]);

        const m = new maplibregl.Map({
          container: holder.current,
          bounds,
          fitBoundsOptions: { padding: 40, maxZoom: 12, animate: false },
          style: {
            version: 8,
            sources: {
              base: {
                type: "raster",
                tiles: [
                  "https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png",
                  "https://b.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png",
                  "https://c.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png",
                ],
                tileSize: 256,
                attribution:
                  '<a href="https://carto.com/attributions">CARTO</a>, OpenStreetMap contributors',
              },
            },
            layers: [{ id: "base", type: "raster", source: "base" }],
          },
          attributionControl: { compact: true },
          cooperativeGestures: true,
        });
        map = m as unknown as { remove: () => void };

        m.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

        for (const p of pins) {
          const el = document.createElement("button");
          el.type = "button";
          el.className = "dmpin";
          el.setAttribute(
            "aria-label",
            p.bandLabel
              ? `${p.name}, ${p.bandLabel.toLowerCase()}`
              : `${p.name}, wealth not read yet`,
          );
          el.style.background = p.band ? ramp[p.band] : "transparent";
          if (!p.band) el.style.borderStyle = "dashed";

          const label = document.createElement("span");
          label.className = "dmlab";
          label.textContent = p.name;
          el.appendChild(label);

          const lines = [p.bandLabel ?? "Wealth not read yet"];
          if (p.rent) lines.push(`Rent ${p.rent} the city rate`);
          const popup = new maplibregl.Popup({
            offset: 16,
            closeButton: false,
            className: "dmpop",
          }).setText(`${p.name}. ${lines.join(". ")}.`);

          new maplibregl.Marker({ element: el, anchor: "center" })
            .setLngLat([p.lng, p.lat])
            .setPopup(popup)
            .addTo(m);
        }
      } catch {
        /* A map that cannot boot must not take the chapter with it. The list
           below carries every fact the map does, so the honest fallback is to
           say the map is unavailable and leave the data standing. */
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      try {
        map?.remove();
      } catch {
        /* already gone */
      }
    };
  }, [pins]);

  if (pins.length === 0) return null;

  const present = BAND_ORDER.filter((b) => pins.some((p) => p.band === b));

  return (
    <div className="panel rise" style={{ marginBottom: 10 }}>
      <div className="pad">
        {/* One line, not a label plus a value. The first render read
            "Where the districts arehow well off" because .s carries no leading
            space and a row puts its two halves hard against each other when
            there is no figure on the right. There is no figure here, so this is
            a heading rather than a row. */}
        <div className="lab" style={{ marginBottom: 10 }}>
          Where the districts are, and how well off each one is against{" "}
          {cityName}&rsquo;s own average
        </div>

        <div
          ref={holder}
          className="dmap"
          role="application"
          aria-label={`Map of ${pins.length} districts in ${cityName}, coloured by how well off each one is`}
        />

        {failed ? (
          <p className="k" style={{ margin: "10px 0 0" }}>
            The map could not load. Every district it would show is listed below.
          </p>
        ) : null}

        {present.length > 0 ? (
          <div className="dmkey" aria-hidden="true">
            {present.map((b) => (
              <span className="dmk" key={b}>
                <i className={`dmk-${b}`} />
                {BAND_SHORT[b]}
              </span>
            ))}
          </div>
        ) : null}

        <p className="k" style={{ margin: "10px 0 0" }}>
          Each point sits on the district&rsquo;s high street, not at its centre, because
          that is where a business would open. We do not draw district boundaries: we
          do not hold them, and the edges are argued over in every city.
        </p>
      </div>
    </div>
  );
}
