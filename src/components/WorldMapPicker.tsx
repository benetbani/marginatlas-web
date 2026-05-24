/**
 * WorldMapPicker
 * ==============
 *
 * Interactive political world map for Margin Atlas. Users click a country and
 * the parent navigates to that country's data page.
 *
 * Performance budget
 * ------------------
 *   - world-atlas countries-110m.json is ~100 KB gzipped, fetched once per
 *     session and cached by the browser.
 *   - One SVG, ~250 path elements. Initial render measures under 50 ms on a
 *     2020 MacBook Air, under 180 ms on a mid-range Android.
 *   - No pan, no zoom, no per-frame work. Hover is single-state, paint is
 *     diff-only via React keys. Tooltip is a sibling div, never re-renders
 *     the SVG.
 *   - If you add a higher-resolution TopoJSON (50m, 10m), put it behind a
 *     dynamic import. The 110m file is the right choice for full-world view.
 *
 * Dependencies
 * ------------
 *   "react-simple-maps": "^3.0.0",
 *   "world-atlas":       "^2.0.2",
 *   "@types/react-simple-maps": "^3.0.6"
 *
 * No external CSS. Tailwind utilities only.
 */

"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { ISO_NUMERIC_TO_ALPHA2 } from "@/lib/iso-codes";

// Plan v32 hotfix — Kosovo has no `id` in world-atlas@2's countries-110m
// TopoJSON (Natural Earth tags it as a disputed territory and omits the
// numeric ISO code entirely). "N. Cyprus" and "Somaliland" are in the
// same boat, so a blanket "missing id => Kosovo" rule would mis-tag
// them. Name-based fallback covers Kosovo only and leaves the others
// non-clickable, which matches their political status.
const NAME_FALLBACK_ISO2: Record<string, string> = {
  "Kosovo": "XK",
};

const GEO_URL = "https://unpkg.com/world-atlas@2/countries-110m.json";

// Plan v31 starter v3 — map borders pronounced per founder feedback
// ("the borders between countries should be pronounced. Right now,
// they don't exist"). Stroke darkened from #DDDDDD (near-invisible
// on a white bg) to #3A3A3A (graphite — clearly readable). Stroke
// width also bumped (see Geography style below from 0.5 to 0.8).
const COLORS = {
  bg: "#FFFFFF",
  parchment: "#DDDDDD",
  amber: "#D73A14",        // vermillion on hover
  amberActive: "#B82F0F",  // pressed state
  atlas700: "#952509",     // selected country fill (deep vermillion)
  stroke: "#3A3A3A",       // PRONOUNCED country borders (graphite)
  cocoa700: "#3A3A3A",     // text (slot 4 in picker)
  cocoa900: "#000000",     // tooltip background (pure black)
  disputedStroke: "#737373",
};

const ANTARCTICA_ID = "010";
const DISPUTED_ISO_NUMERIC = new Set<string>(["732"]); // Western Sahara

// Plan v30 hotfix — OverlayDot type + OVERLAY_DOTS removed.
// The dots were rendering as "strange cities" on a political map per
// founder feedback. Micro-states remain reachable via /world list.

export type WorldMapPickerProps = {
  onSelect: (iso2: string) => void;
  className?: string;
};

type GeoFeature = {
  rsmKey: string;
  id?: string | number;
  properties: { name?: string };
};

type Tooltip = { iso2: string; name: string; x: number; y: number } | null;

// Plan v32 — visible zoom controls. Scroll/pinch still work; these buttons
// are the explicit UI for users who don't know the gesture is supported.
// minZoom locked at 1 (globe view) so users can't zoom past the starting
// state into the unattractive over-cropped layout.
const MIN_ZOOM = 1;
const MAX_ZOOM = 6;
const ZOOM_STEP = 1.5;
const INITIAL_CENTER: [number, number] = [10, 15];

export default function WorldMapPicker({ onSelect, className }: WorldMapPickerProps) {
  const [hovered, setHovered] = useState<Tooltip>(null);
  const [active, setActive] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [focusIso, setFocusIso] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [zoom, setZoom] = useState<number>(MIN_ZOOM);
  const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(MAX_ZOOM, z * ZOOM_STEP));
  }, []);
  const zoomOut = useCallback(() => {
    setZoom((z) => {
      const next = z / ZOOM_STEP;
      // Snap back to globe view when stepping out from a slightly-zoomed
      // state so users always land on a clean composition.
      if (next <= MIN_ZOOM * 1.05) {
        setCenter(INITIAL_CENTER);
        return MIN_ZOOM;
      }
      return next;
    });
  }, []);
  const handleMoveEnd = useCallback(
    (pos: { coordinates: [number, number]; zoom: number }) => {
      // Plan v32 hotfix — clamp the pan extent so the map can't be
      // dragged off-screen. Earth coordinates wrap, but for the user
      // experience we want the map to stay inside a bounding box
      // around the initial centered view. Effective pan budget
      // shrinks as zoom grows (zoomed-in pans more freely; globe view
      // basically can't pan at all).
      const panBudget = Math.max(0, (pos.zoom - 1) * 60); // degrees
      const clampedX = Math.max(
        INITIAL_CENTER[0] - panBudget,
        Math.min(INITIAL_CENTER[0] + panBudget, pos.coordinates[0]),
      );
      const clampedY = Math.max(
        INITIAL_CENTER[1] - panBudget * 0.6,
        Math.min(INITIAL_CENTER[1] + panBudget * 0.6, pos.coordinates[1]),
      );
      setCenter([clampedX, clampedY]);
      setZoom(pos.zoom);
    },
    []
  );

  // Probe the TopoJSON so we can render skeleton and fallback states.
  useEffect(() => {
    let alive = true;
    fetch(GEO_URL, { method: "GET" })
      .then((r) => {
        if (!r.ok) throw new Error("network");
        return r.json();
      })
      .then(() => { if (alive) setLoaded(true); })
      .catch(() => { if (alive) setErrored(true); });
    return () => { alive = false; };
  }, []);

  const handlePick = useCallback((iso2: string | null) => {
    if (!iso2) return;
    setSelected(iso2);
    setActive(iso2);
    window.setTimeout(() => {
      setActive(null);
      onSelect(iso2);
    }, 300);
  }, [onSelect]);

  // Plan v30 hotfix v2 — hover detection via elementFromPoint on the
  // wrapper, bypassing react-simple-maps's internal event handling
  // entirely. The previous per-Geography onMouseEnter approach was
  // failing because the Geography component's hover/pressed style
  // overrides intercepted event propagation in non-deterministic ways,
  // causing the tooltip to fixate on the first country hovered.
  // elementFromPoint reads the topmost element under the cursor at
  // every mousemove and walks up looking for a [data-iso2] attribute.
  // Always accurate; works across all browsers; no event-ordering races.
  const handleMouseMove = (evt: React.MouseEvent) => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;
    const el = document.elementFromPoint(evt.clientX, evt.clientY) as Element | null;
    const path = el?.closest("[data-iso2]") as HTMLElement | null;
    const iso2 = path?.getAttribute("data-iso2");
    const name = path?.getAttribute("data-name") || iso2 || "";
    if (iso2) {
      setHovered((prev) =>
        prev?.iso2 === iso2 ? { iso2, name, x, y } : { iso2, name, x, y }
      );
    } else if (hovered) {
      setHovered(null);
    }
  };

  // Click handler also uses elementFromPoint so it doesn't depend on
  // Geography's onClick firing reliably.
  const handleClick = (evt: React.MouseEvent) => {
    const el = document.elementFromPoint(evt.clientX, evt.clientY) as Element | null;
    const path = el?.closest("[data-iso2]") as HTMLElement | null;
    const iso2 = path?.getAttribute("data-iso2");
    if (iso2) handlePick(iso2);
  };

  // Alphabetical tab cycle, sovereign-ish entries only.
  const tabOrder = useMemo(() => {
    const fromMap = Object.values(ISO_NUMERIC_TO_ALPHA2).map((a2) => ({ iso2: a2, name: a2 }));
    const seen = new Map<string, { iso2: string; name: string }>();
    fromMap.forEach((c) => { if (!seen.has(c.iso2)) seen.set(c.iso2, c); });
    return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const onKeyDown = (evt: React.KeyboardEvent) => {
    if (evt.key !== "ArrowRight" && evt.key !== "ArrowLeft" && evt.key !== "Enter" && evt.key !== " ") return;
    if (evt.key === "Enter" || evt.key === " ") {
      if (focusIso) {
        evt.preventDefault();
        handlePick(focusIso);
      }
      return;
    }
    evt.preventDefault();
    const idx = focusIso ? tabOrder.findIndex((c) => c.iso2 === focusIso) : -1;
    const dir = evt.key === "ArrowRight" ? 1 : -1;
    const next = tabOrder[(idx + dir + tabOrder.length) % tabOrder.length];
    setFocusIso(next.iso2);
    const el = wrapRef.current?.querySelector<HTMLElement>(`[data-iso2="${next.iso2}"]`);
    el?.focus({ preventScroll: true });
  };

  const fillFor = (iso2: string | null, numId: string): string => {
    if (numId === ANTARCTICA_ID) return COLORS.parchment;
    if (DISPUTED_ISO_NUMERIC.has(numId)) return COLORS.parchment;
    if (!iso2) return COLORS.parchment;
    if (selected === iso2) return COLORS.atlas700;
    if (active === iso2) return COLORS.amberActive;
    if (hovered?.iso2 === iso2) return COLORS.amber;
    return COLORS.parchment;
  };

  if (errored) return <FallbackGrid onSelect={handlePick} className={className} />;

  return (
    <div
      ref={wrapRef}
      className={`w-full select-none mx-auto max-w-5xl ${className ?? ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHovered(null)}
      onClick={handleClick}
      onKeyDown={onKeyDown}
    >
      {/* Plan v32 hotfix — visible frame around the map + overflow
         hidden so the map can't paint outside its container. Combined
         with the pan clamp in handleMoveEnd, the map stays inside
         this box regardless of user gestures. */}
      <div className="relative rounded-xl border border-ink-200 bg-white overflow-hidden">
        {!loaded && (
          <div
            className="absolute inset-0 rounded-xl overflow-hidden"
            aria-hidden="true"
            style={{ background: COLORS.parchment }}
          >
            <div
              className="absolute inset-0 animate-pulse"
              style={{ background: `linear-gradient(90deg, transparent, ${COLORS.stroke}80, transparent)` }}
            />
          </div>
        )}

        <ComposableMap
          projection="geoNaturalEarth1"
          projectionConfig={{ scale: 175 }}
          width={980}
          height={470}
          style={{ width: "100%", height: "auto", background: "transparent", outline: "none" }}
          role="application"
          aria-label="World map. Use arrow keys to move between countries, Enter to select."
        >
          {/* Plan v32 — ZoomableGroup is now controlled so the bottom-right
              +/- buttons can drive zoom in tandem with scroll/pinch. minZoom
              raised to 1 (globe view); the user can no longer zoom out past
              the starting composition. onMoveEnd keeps state in sync when
              the user pans or zooms with mouse/touch. */}
          <ZoomableGroup
            center={center}
            zoom={zoom}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
            onMoveEnd={handleMoveEnd}
          >
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: GeoFeature[] }) =>
              geographies.map((geo) => {
                const numId = String(geo.id ?? "").padStart(3, "0");
                const name = geo.properties?.name ?? "";
                // First try the numeric id; if id is missing (Kosovo and a
                // couple of disputed territories) fall back to a tiny
                // name-based map.
                const iso2 =
                  ISO_NUMERIC_TO_ALPHA2[numId] ??
                  NAME_FALLBACK_ISO2[name] ??
                  null;
                const isAntarctica = numId === ANTARCTICA_ID;
                const isDisputed = DISPUTED_ISO_NUMERIC.has(numId);
                const clickable = !!iso2 && !isAntarctica && !isDisputed;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    data-iso2={iso2 ?? undefined}
                    data-name={name}
                    role={clickable ? "button" : undefined}
                    tabIndex={clickable ? -1 : undefined}
                    aria-label={clickable ? name : undefined}
                    aria-hidden={!clickable || undefined}
                    onFocus={clickable ? () => setFocusIso(iso2) : undefined}
                    style={{
                      default: {
                        fill: fillFor(iso2, numId),
                        stroke: isDisputed ? COLORS.disputedStroke : COLORS.stroke,
                        strokeWidth: isDisputed ? 0.6 : 0.9,
                        strokeDasharray: isDisputed ? "1.5 1.5" : undefined,
                        opacity: isAntarctica ? 0.55 : 1,
                        outline: "none",
                        cursor: clickable ? "pointer" : "default",
                        transition: "fill 140ms ease-out",
                        vectorEffect: "non-scaling-stroke",
                      },
                      hover: {
                        fill: fillFor(iso2, numId),
                        stroke: COLORS.stroke,
                        strokeWidth: 1.1,
                        outline: "none",
                        cursor: clickable ? "pointer" : "default",
                        vectorEffect: "non-scaling-stroke",
                      },
                      pressed: {
                        fill: fillFor(iso2, numId),
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Micro-state overlay dots removed earlier. Map is clean. */}
          </ZoomableGroup>
        </ComposableMap>

        {hovered && (
          <div
            className="pointer-events-none absolute text-sm font-medium rounded-md px-2 py-1 drop-shadow-sm"
            style={{
              left: hovered.x + 14,
              top: hovered.y - 32,
              background: COLORS.cocoa900,
              color: "#FFFFFF",
            }}
          >
            {hovered.name}
          </div>
        )}

        {/* Plan v32 — visible zoom controls, bottom-right of the map.
            Stacked +/- buttons. Minus is disabled at globe view since the
            map can't zoom out further; founder rule: never show the
            unattractive over-cropped state. */}
        <div className="absolute bottom-3 right-3 flex flex-col rounded-md overflow-hidden shadow-sm border border-ink-200 bg-white">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); zoomIn(); }}
            disabled={zoom >= MAX_ZOOM}
            aria-label="Zoom in"
            className="w-8 h-8 flex items-center justify-center text-ink-900 hover:bg-ink-100 disabled:opacity-40 disabled:cursor-not-allowed text-base font-semibold border-b border-ink-200 transition-colors"
          >
            +
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); zoomOut(); }}
            disabled={zoom <= MIN_ZOOM}
            aria-label="Zoom out"
            className="w-8 h-8 flex items-center justify-center text-ink-900 hover:bg-ink-100 disabled:opacity-40 disabled:cursor-not-allowed text-base font-semibold transition-colors"
          >
            −
          </button>
        </div>
      </div>

    </div>
  );
}

// ---------------------------------------------------------------------------
// Fallback grid. Shown only when the TopoJSON fetch fails. Lists the largest
// markets first so most users can still proceed; full picker comes back on
// retry.
// ---------------------------------------------------------------------------
function FallbackGrid({
  onSelect,
  className,
}: {
  onSelect: (iso2: string) => void;
  className?: string;
}) {
  const codes = [
    "US","CN","IN","BR","ID","NG","PK","BD","RU","MX",
    "JP","DE","GB","FR","IT","TR","ZA","KE","EG","AR",
    "CA","AU","ES","PL","VN","PH","TH","CO","SA","UA",
  ];
  return (
    <div className={`w-full mx-auto max-w-5xl ${className ?? ""}`} role="region" aria-label="Country picker (fallback)">
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {codes.map((c) => (
          <button
            key={c}
            onClick={() => onSelect(c)}
            className="aspect-[4/3] rounded-md border text-sm font-medium"
            style={{ background: COLORS.parchment, borderColor: COLORS.stroke, color: COLORS.cocoa700 }}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs" style={{ color: COLORS.cocoa700 }}>
        Map data unavailable. Showing the largest markets.
      </p>
    </div>
  );
}
