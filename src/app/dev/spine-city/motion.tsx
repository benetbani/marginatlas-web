"use client";
/**
 * Page-local motion helpers for the city page , count-up-safe figures + a
 * terracotta top-edge card hover, mirroring the cell-page pattern (format-picker
 * useCountUp) but kept out of the shared kit. THE COUNT-UP CONTRACT: the resting
 * value is always the real target , SSR / no-JS / reduced-motion / not-yet-in-view
 * all render the true number, never a 0 , and `active` gates only the animation.
 * The first reveal tweens from 85% of the target (never from 0), so no paint,
 * capture, or crawler frame ever shows a figure that contradicts its own caption.
 */
import * as React from "react";
import { TERRA } from "@/components/spine/kit";

export function useReducedMotion() {
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

export function useCountUp(target: number, reduced: boolean, ms = 620, active = true) {
  const [v, setV] = React.useState(target);
  const from = React.useRef(0);
  const done = React.useRef(false);
  React.useEffect(() => {
    if (reduced || !active) { setV(target); from.current = target; return; }
    const start = performance.now();
    // first reveal starts at 85% of the target (NEVER 0): any mid-tween frame is
    // within rounding distance of the truth; later target switches tween prev -> next.
    const a = done.current ? from.current : target * 0.85;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const e = 1 - Math.pow(1 - t, 3);
      setV(a + (target - a) * e);
      if (t < 1) raf = requestAnimationFrame(tick);
      else { from.current = target; done.current = true; }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduced, ms, active]);
  return v;
}

export function useInView<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return { ref, seen };
}

/* a figure that counts up the first time it scrolls into view (never renders 0) */
export function CountFig({ value, fmt, className }: { value: number; fmt: (n: number) => React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const { ref, seen } = useInView<HTMLSpanElement>();
  const v = useCountUp(value, reduced, 560, seen);
  return <span ref={ref} className={`fig ${className ?? ""}`}>{fmt(v)}</span>;
}

/* terracotta top-edge hover on every card (reduced-motion safe). Injected once. */
export function CityStyles() {
  return (
    <style>{`.spine-scope .citytop{position:relative;transition:transform .15s ease-out,border-color .15s ease-out}
.spine-scope .citytop::before{content:"";position:absolute;left:14px;right:14px;top:0;height:2px;border-radius:9999px;background:${TERRA};opacity:0;transition:opacity .15s ease-out}
.spine-scope .citytop:hover::before{opacity:1}
@media (prefers-reduced-motion:reduce){.spine-scope .citytop{transition:none}}`}</style>
  );
}
