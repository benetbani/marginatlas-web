"use client";
/**
 * Page-local motion primitives for the country spine page. Count-up-safe by
 * construction: the RESTING value is always the real target (SSR / no-JS /
 * reduced-motion / not-yet-in-view all render the true number, never 0). The
 * in-view flag gates only the ANIMATION. Mirrors the reference pattern in
 * spine-cell/format-picker.tsx (useCountUp rests at target). Reduced-motion safe.
 *
 * Nothing here is a new CHART form; these wrap existing kit output so the shared
 * kit stays untouched.
 */
import * as React from "react";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

/* Reveal wrapper: when the block first scrolls into view, sets a data-attr the
 * children can key a CSS transition off (bars grow, cards settle). Rests visible
 * always. reduced-motion + no-JS both leave it fully shown. */
export function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [seen, setSeen] = React.useState(false);
  const reduced = usePrefersReducedMotion();
  React.useEffect(() => {
    if (reduced) { setSeen(true); return; }
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [seen, reduced]);
  return (
    <div ref={ref} data-seen={seen ? "1" : "0"} className={`reveal ${className}`}>{children}</div>
  );
}

/* Count a figure toward its target on first in-view. Rests at the real target
 * on SSR / no-JS / reduced-motion (never 0). The reveal tweens from 85% of the
 * target (the sanctioned spine-city/motion pattern, P5): a mid-tween capture must
 * sit within rounding distance of the truth, never a near-zero transient. */
export function CountFig({ target, prefix = "", suffix = "", decimals = 0, ms = 620, className = "" }: { target: number; prefix?: string; suffix?: string; decimals?: number; ms?: number; className?: string }) {
  const reduced = usePrefersReducedMotion();
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const [v, setV] = React.useState(target); // rest at target
  const started = React.useRef(false);
  React.useEffect(() => {
    if (reduced) { setV(target); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / ms);
          const e2 = 1 - Math.pow(1 - t, 3);
          setV(target * (0.85 + 0.15 * e2)); // 85% -> target, never a near-zero frame
          if (t < 1) requestAnimationFrame(tick);
          else setV(target);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      }
    }, { rootMargin: "0px 0px -10% 0px" });
    // seed to 0 only once we KNOW JS runs and we are about to animate into view
    io.observe(el);
    return () => io.disconnect();
  }, [target, reduced, ms]);
  return <span ref={ref} className={`fig ${className}`}>{prefix}{v.toFixed(decimals)}{suffix}</span>;
}
