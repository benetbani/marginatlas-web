"use client";
/**
 * CrumbFit , the trail's one script (release 3: the rhythm-gates review, Important 2 and Minor 1). Runs crumbFit
 * (src/lib/spine/crumb_fit.ts) on its parent, the Crumbs nav, after layout, when the fonts are ready and whenever the nav's width
 * changes: a middle step that gave way shows the mark, and a step that gave way leaves the tab order. Draws nothing of its own.
 */
import * as React from "react";
import { crumbFit } from "@/lib/spine/crumb_fit";

export function CrumbFit() {
  const ref = React.useRef<HTMLSpanElement>(null);
  React.useLayoutEffect(() => {
    const nav = ref.current?.parentElement;
    if (!nav) return;
    const run = () => { crumbFit(nav); };
    run();
    void document.fonts?.ready.then(run);
    const ro = new ResizeObserver(run);
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);
  return <span ref={ref} hidden />;
}
