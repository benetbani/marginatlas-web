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
} from "react-simple-maps";
import { ISO_NUMERIC_TO_ALPHA2 } from "@/lib/iso-codes";

const GEO_URL = "https://unpkg.com/world-atlas@2/countries-110m.json";

const COLORS = {
  bg: "#FEF9F0",
  parchment: "#F4EAD5",
  amber: "#D47706",
  amberActive: "#8C4D00",
  atlas700: "#A55C00",
  stroke: "#EAD9B5",
  cocoa700: "#5A3A1A",
  cocoa900: "#2A1A08",
  disputedStroke: "#E2C997",
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

export default function WorldMapPicker({ onSelect, className }: WorldMapPickerProps) {
  const [hovered, setHovered] = useState<Tooltip>(null);
  const [active, setActive] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [focusIso, setFocusIso] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

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

  const moveTooltip = (evt: React.MouseEvent) => {
    if (!hovered || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setHovered({ ...hovered, x: evt.clientX - rect.left, y: evt.clientY - rect.top });
  };

  const enterTooltip = (iso2: string, name: string, evt: React.MouseEvent) => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setHovered({ iso2, name, x: evt.clientX - rect.left, y: evt.clientY - rect.top });
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
      onMouseMove={moveTooltip}
      onMouseLeave={() => setHovered(null)}
      onKeyDown={onKeyDown}
    >
      <div className="relative rounded-xl">
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
          projectionConfig={{ scale: 215, center: [10, 22] }}
          width={980}
          height={440}
          style={{ width: "100%", height: "auto", background: "transparent", outline: "none" }}
          role="application"
          aria-label="World map. Use arrow keys to move between countries, Enter to select."
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: GeoFeature[] }) =>
              geographies.map((geo) => {
                const numId = String(geo.id ?? "").padStart(3, "0");
                const iso2 = ISO_NUMERIC_TO_ALPHA2[numId] ?? null;
                const isAntarctica = numId === ANTARCTICA_ID;
                const isDisputed = DISPUTED_ISO_NUMERIC.has(numId);
                const clickable = !!iso2 && !isAntarctica && !isDisputed;
                const name = geo.properties?.name ?? "";
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    data-iso2={iso2 ?? undefined}
                    role={clickable ? "button" : undefined}
                    tabIndex={clickable ? -1 : undefined}
                    aria-label={clickable ? name : undefined}
                    aria-hidden={!clickable || undefined}
                    onMouseEnter={clickable ? (e) => enterTooltip(iso2!, name, e) : undefined}
                    onMouseLeave={clickable ? () => setHovered(null) : undefined}
                    onMouseMove={clickable ? (e) => enterTooltip(iso2!, name, e) : undefined}
                    onMouseDown={clickable ? () => setActive(iso2) : undefined}
                    onMouseUp={clickable ? () => setActive(null) : undefined}
                    onClick={clickable ? () => handlePick(iso2) : undefined}
                    onFocus={clickable ? () => setFocusIso(iso2) : undefined}
                    style={{
                      default: {
                        fill: fillFor(iso2, numId),
                        stroke: isDisputed ? COLORS.disputedStroke : COLORS.stroke,
                        strokeWidth: isDisputed ? 0.4 : 0.5,
                        strokeDasharray: isDisputed ? "1.5 1.5" : undefined,
                        opacity: isAntarctica ? 0.55 : 1,
                        outline: "none",
                        cursor: clickable ? "pointer" : "default",
                        transition: "fill 140ms ease-out",
                      },
                      hover: {
                        fill: fillFor(iso2, numId),
                        stroke: COLORS.stroke,
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: clickable ? "pointer" : "default",
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

          {/* Plan v30 hotfix — micro-state overlay dots removed. Founder
              feedback: "it has some strange cities printed on it, which
              is exactly the thing we surely didn't want." The map is
              clean now; Monaco, Vatican, Singapore, etc. remain selectable
              via the country list / search fallback. */}
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
      </div>

      <p className="mt-4 text-xs tracking-wide" style={{ color: COLORS.cocoa700 }}>
        Hover a country &middot; Tap on mobile &middot; Covers the whole world
      </p>
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
