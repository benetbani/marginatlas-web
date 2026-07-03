"use client";
/**
 * SpineMap , a real interactive MapLibre map for the spine pages. SSR-safe: the
 * server renders a sized container only; the map boots in useEffect (client),
 * guards against double-init, and tears down on unmount. No API key: a raster
 * basemap (Carto Positron, NO-LABEL variant) with the three subdomains given
 * explicitly , so our terracotta markers and their labels are the ONLY labels on
 * the map (the basemap no longer competes for attention). A subtle warm CSS filter
 * on the canvas keeps it on the warm-neutral palette (no blue). Each point is a
 * terracotta button marker (keyboard-accessible, aria-labelled), sized by an optional
 * signal, with a haloed label; hover/focus raises an on-brand popup (place name +
 * the signal figure + optional sub) for info scent before navigating. Clicking a
 * marker navigates (href) or calls onSelect. Bounds fit all points; fly/zoom
 * animation is suppressed under prefers-reduced-motion. NavigationControl + the
 * attribution control stay visible, restyled to the warm palette. An optional
 * dot-size legend (bottom-left) explains the encoding. Composed into the
 * country/city spine pages.
 */
import * as React from "react";
import { useRouter } from "next/navigation";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export type SpinePoint = {
  name: string;
  slug?: string;
  lat: number;
  lng: number;
  href?: string;
  signal?: number; // 0..100-ish, scales the dot size
  signalLabel?: string; // short unit phrase for the popup figure, e.g. "+55% vs city" or "market 92"
  sub?: string;
};

const TERRA_ACCENT = "#c2410c"; // the marker fill (atlas terracotta accent)
const INK = "#1b1b1a";
const BORDER = "#e7e2df";
const MUTED = "#6f6f6d";

/* Carto Positron NO-LABEL raster style, no API key. The no-label variant means the
 * basemap carries no place names, so our markers/labels are the only labels , the
 * key hierarchy move. Three subdomains as an explicit tiles array. */
const POSITRON_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    carto: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "(c) OpenStreetMap (c) CARTO",
    },
  },
  layers: [{ id: "carto", type: "raster", source: "carto" }],
};

/* Scoped style block: warm-palette restyle of the maplibre NavigationControl +
 * attribution (default is blue/grey), a terracotta focus-visible ring on the marker
 * buttons, touch-action manipulation, and the popup chrome. Injected once. */
const SCOPED_CSS = `
.spinemap-root .maplibregl-ctrl-group{
  border:1px solid ${BORDER};border-radius:10px;overflow:hidden;
  background:#fcfbfa;box-shadow:0 1px 2px rgba(43,28,22,0.10);
}
.spinemap-root .maplibregl-ctrl-group button{
  background:#fcfbfa;
}
.spinemap-root .maplibregl-ctrl-group button:not(:disabled):hover{
  background:var(--terra-soft,#fff1ed);
}
.spinemap-root .maplibregl-ctrl-group button:focus-visible{
  outline:none;box-shadow:inset 0 0 0 2px ${TERRA_ACCENT};
}
.spinemap-root .maplibregl-ctrl-group button + button{border-top:1px solid ${BORDER};}
.spinemap-root .maplibregl-ctrl-attrib{
  background:rgba(252,251,250,0.86);border-radius:8px 0 0 0;
  color:${MUTED};font-size:10px;
}
.spinemap-root .maplibregl-ctrl-attrib a{color:${MUTED};}
.spinemap-root .spinemap-marker{touch-action:manipulation;}
.spinemap-root .spinemap-marker:focus-visible{outline:none;}
.spinemap-root .spinemap-marker:focus-visible .spinemap-dot{
  box-shadow:0 0 0 3px rgba(255,255,255,0.92),0 0 0 6px rgba(194,65,12,0.55),0 1px 3px rgba(43,28,22,0.35);
}
.spinemap-root .maplibregl-popup.spinemap-pop .maplibregl-popup-content{
  padding:8px 10px;border-radius:10px;border:1px solid ${BORDER};
  background:#ffffff;box-shadow:0 6px 18px -8px rgba(43,28,22,0.22);
}
.spinemap-root .maplibregl-popup.spinemap-pop .maplibregl-popup-tip{
  border-top-color:#ffffff;
}
@media (prefers-reduced-motion: reduce){
  .spinemap-root .spinemap-dot{transition:none !important;}
}
`;

/* The popup inner HTML , a white kit card: name in bold ink, the signal as a
 * terracotta .fig figure with its short unit label, then the optional sub line. */
function popupHTML(p: SpinePoint): string {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const fig =
    p.signalLabel
      ? `<div style="font-family:var(--font-grotesk),system-ui,sans-serif;font-weight:600;font-variant-numeric:tabular-nums;font-size:12.5px;color:${TERRA_ACCENT};margin-top:2px;letter-spacing:.01em;">${esc(
          p.signalLabel
        )}</div>`
      : "";
  const sub = p.sub
    ? `<div style="font-size:11px;color:${MUTED};margin-top:2px;max-width:180px;">${esc(
        p.sub
      )}</div>`
    : "";
  return (
    `<div style="font-family:var(--font-grotesk),system-ui,sans-serif;">` +
    `<div style="font-size:12.5px;font-weight:700;color:${INK};letter-spacing:.01em;">${esc(
      p.name
    )}</div>` +
    fig +
    sub +
    `</div>`
  );
}

type MarkerBuild = {
  btn: HTMLButtonElement;
  setActive: (on: boolean) => void; // hovered/focused state: enlarge dot + force label visible
  setCrowded: (on: boolean) => void; // hide the label until hover when packed against a neighbour
};

/* Build the DOM element for one marker: a real button (focusable, aria-labelled),
 * a terracotta dot whose size scales by signal, and a haloed label beside it. When
 * `crowded`, the label is hidden by default and only shown on hover/focus (so packed
 * clusters like the central London trio do not overlap). */
function buildMarkerEl(
  p: SpinePoint,
  onActivate: () => void,
  onActiveChange: (on: boolean) => void
): MarkerBuild {
  const sig = typeof p.signal === "number" ? Math.max(0, Math.min(100, p.signal)) : 50;
  const size = Math.round(12 + (sig / 100) * 12); // 12px..24px

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "spinemap-marker";
  btn.setAttribute("aria-label", p.sub ? `${p.name}, ${p.sub}` : p.name);
  // Hit area >= 24px (the dot can be as small as 12px): pad the button so the tap
  // target clears the 24px floor without moving the dot/label.
  btn.style.cssText =
    "display:flex;align-items:center;gap:6px;background:transparent;border:0;" +
    "padding:6px 6px 6px 0;margin:-6px 0 -6px 0;cursor:pointer;font:inherit;" +
    "min-height:24px;border-radius:8px;transform:translateY(-1px);";

  const dot = document.createElement("span");
  dot.className = "spinemap-dot";
  dot.style.cssText =
    `display:block;width:${size}px;height:${size}px;border-radius:9999px;background:${TERRA_ACCENT};` +
    "box-shadow:0 0 0 3px rgba(255,255,255,0.92),0 1px 3px rgba(43,28,22,0.35);transition:transform .12s ease;flex:0 0 auto;";

  const label = document.createElement("span");
  label.textContent = p.name;
  label.style.cssText =
    "font-family:var(--font-grotesk),system-ui,sans-serif;font-size:11.5px;font-weight:600;" +
    "color:#1b1b1a;white-space:nowrap;letter-spacing:.01em;" +
    // paint-order style white halo so the label reads over any tile
    "paint-order:stroke fill;-webkit-text-stroke:3px rgba(255,255,255,0.92);" +
    "text-shadow:0 1px 0 rgba(255,255,255,0.9),0 0 2px rgba(255,255,255,0.9);" +
    "transition:opacity .12s ease;"; // visible by default; setCrowded() hides it in dense clusters

  btn.appendChild(dot);
  btn.appendChild(label);

  let isCrowded = false;
  let isActive = false;
  const applyLabel = () => { label.style.opacity = !isCrowded || isActive ? "1" : "0"; };
  const setCrowded = (on: boolean) => { isCrowded = on; applyLabel(); };
  const setActive = (on: boolean) => {
    isActive = on;
    dot.style.transform = on ? "scale(1.18)" : "scale(1)";
    applyLabel();
  };
  const enter = () => { setActive(true); onActiveChange(true); };
  const leave = () => { setActive(false); onActiveChange(false); };
  btn.addEventListener("mouseenter", enter);
  btn.addEventListener("mouseleave", leave);
  btn.addEventListener("focus", enter);
  btn.addEventListener("blur", leave);
  btn.addEventListener("click", (e) => { e.stopPropagation(); onActivate(); });

  return { btn, setActive, setCrowded };
}

export function SpineMap({
  points,
  fitPadding = 64,
  onSelect,
  ariaLabel = "Interactive map",
  className = "",
  legendLabel,
}: {
  points: SpinePoint[];
  fitPadding?: number;
  onSelect?: (p: SpinePoint) => void;
  ariaLabel?: string;
  className?: string;
  legendLabel?: string; // when set, renders the bottom-left dot-size legend, e.g. "Dot size = revenue vs city"
}) {
  const router = useRouter();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<maplibregl.Map | null>(null);
  const markersRef = React.useRef<maplibregl.Marker[]>([]);

  // Keep the latest handlers/points in refs so the boot effect runs once.
  const pointsRef = React.useRef(points);
  pointsRef.current = points;
  const onSelectRef = React.useRef(onSelect);
  onSelectRef.current = onSelect;
  const routerRef = React.useRef(router);
  routerRef.current = router;
  // false until the map actually paints. Drives the overlay list, which is the
  // server-render default (progressive enhancement) AND the no-WebGL fallback.
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    // Client-only; guard against double-init (StrictMode / re-render).
    if (typeof window === "undefined") return;
    if (mapRef.current || !containerRef.current) return;

    const pts = pointsRef.current.filter(
      (p) => Number.isFinite(p.lat) && Number.isFinite(p.lng)
    );
    if (pts.length === 0) return;

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container: containerRef.current,
        style: POSITRON_STYLE,
        center: [pts[0].lng, pts[0].lat],
        zoom: 5,
        attributionControl: { compact: true },
        dragRotate: false,
        pitchWithRotate: false,
      });
    } catch {
      // No WebGL (some browsers / headless block it): leave `ready` false so the
      // overlay list stays as the fallback.
      return;
    }
    mapRef.current = map;
    map.on("error", () => { /* swallow tile/network errors so the page never crashes */ });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.keyboard.enable();

    // Pre-compute which markers are "crowded" and must hide their label until
    // hover/focus. LABEL-BOX aware (not just dot distance): a label sits to the
    // RIGHT of its dot, so a wide name ("Covent Garden") can overlap a neighbour
    // whose dot is well clear. We build each marker's dot+label bounding box, then
    // greedily keep labels in priority order (highest signal first) and hide any
    // whose box overlaps an already-kept label. This keeps the important labels and
    // silences only the ones that would actually collide.
    const labelW = (p: SpinePoint) => Math.min(124, (p.name ? p.name.length : 0) * 6.6 + 12);
    const crowdedFlags = (): boolean[] => {
      const boxes = pts.map((p) => {
        const pt = map.project([p.lng, p.lat]);
        const sig = typeof p.signal === "number" ? Math.max(0, Math.min(100, p.signal)) : 50;
        const size = Math.round(12 + (sig / 100) * 12);
        const x0 = pt.x; // dot left
        const x1 = pt.x + size + 6 + labelW(p); // through end of label
        return { x0, x1, y: pt.y, sig };
      });
      const order = pts.map((_, i) => i).sort((a, b) => boxes[b].sig - boxes[a].sig);
      const kept: Array<{ x0: number; x1: number; y: number }> = [];
      const crowded = new Array(pts.length).fill(false);
      for (const i of order) {
        const b = boxes[i];
        const hit = kept.some((q) => Math.abs(q.y - b.y) < 13 && b.x0 < q.x1 && q.x0 < b.x1);
        if (hit) crowded[i] = true;
        else kept.push(b);
      }
      return crowded;
    };

    const fitToPoints = () => {
      const b = new maplibregl.LngLatBounds();
      pts.forEach((p) => b.extend([p.lng, p.lat]));
      if (pts.length === 1) {
        map.jumpTo({ center: [pts[0].lng, pts[0].lat], zoom: 11 });
      } else {
        map.fitBounds(b, { padding: fitPadding, animate: !reduceMotion, maxZoom: 13 });
      }
    };

    // One reusable popup (no close button, offset above the dot). Hover/focus shows
    // it; mouseleave/blur hides it. Reduced-motion: maplibre has no popup transition
    // so nothing to suppress, but we keep it light either way.
    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 16,
      className: "spinemap-pop",
      anchor: "bottom",
      focusAfterOpen: false,
    });

    map.on("load", () => {
      fitToPoints();
      const builds: MarkerBuild[] = [];
      pts.forEach((p) => {
        const showPopup = () => {
          popup.setLngLat([p.lng, p.lat]).setHTML(popupHTML(p)).addTo(map);
        };
        const bld = buildMarkerEl(
          p,
          () => {
            if (p.href) routerRef.current.push(p.href);
            else onSelectRef.current?.(p);
          },
          (on) => {
            if (on) showPopup();
            else popup.remove();
          }
        );
        const marker = new maplibregl.Marker({ element: bld.btn, anchor: "left" })
          .setLngLat([p.lng, p.lat])
          .addTo(map);
        markersRef.current.push(marker);
        builds.push(bld);
      });
      // Crowding must be measured at the FITTED zoom, not the initial one (where every
      // point overlaps and every label would hide). Recompute once the camera settles,
      // and again after any pan/zoom so labels stay decluttered as the view changes.
      const recomputeCrowding = () => {
        const crowded = crowdedFlags();
        builds.forEach((bld, i) => bld.setCrowded(crowded[i]));
      };
      map.once("idle", recomputeCrowding);
      map.on("moveend", recomputeCrowding);
      setReady(true); // map painted: drop the overlay list, reveal the map
    });

    return () => {
      popup.remove();
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
    // Boot once. Live point/handler changes flow through the refs above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitPadding]);

  const activate = (p: SpinePoint) => {
    if (p.href) router.push(p.href);
    else onSelect?.(p);
  };

  return (
    <div
      className={`spinemap-root relative overflow-hidden rounded-[14px] border border-[var(--c-border)] ${className}`}
    >
      <style>{SCOPED_CSS}</style>
      <div
        ref={containerRef}
        role="application"
        aria-label={ariaLabel}
        className="h-[440px] w-full md:h-[560px]"
        style={{ filter: "sepia(.10) saturate(.92) brightness(1.02)" }}
      />
      {ready && legendLabel ? (
        // Dot-size legend , a small white kit card, bottom-left, explaining the encoding.
        <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2.5 rounded-[10px] border border-[var(--c-border)] bg-[var(--c-card)]/95 px-2.5 py-1.5 shadow-[0_1px_2px_rgba(43,28,22,0.10)]">
          <span className="flex items-end gap-1.5" aria-hidden="true">
            <span className="block h-[8px] w-[8px] rounded-full" style={{ background: TERRA_ACCENT }} />
            <span className="block h-[16px] w-[16px] rounded-full" style={{ background: TERRA_ACCENT }} />
          </span>
          <span className="text-[10.5px] font-medium leading-tight text-[var(--c-ink2)]">{legendLabel}</span>
        </div>
      ) : null}
      {!ready ? (
        // Default (server render, no-JS preview) AND the no-WebGL fallback: a clickable
        // list overlay so every place is reachable. Removed the moment the map paints.
        <div className="absolute inset-0 overflow-auto bg-[var(--c-card)] p-4">
          <p className="mb-3 text-[12px] text-[var(--c-muted)]">Choose a place to explore:</p>
          <div className="flex flex-wrap gap-2">
            {points.map((p) => (
              <button
                key={p.slug ?? p.name}
                type="button"
                onClick={() => activate(p)}
                style={{ touchAction: "manipulation" }}
                className="cityhov rounded-full border border-[var(--c-border)] bg-[var(--c-card)] px-3 py-1.5 text-[13px] font-medium text-[var(--c-ink)] transition hover:border-[var(--terra-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--terra-text)]"
              >
                {p.name}
                {p.sub ? <span className="text-[var(--c-muted)]"> ({p.sub})</span> : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default SpineMap;
