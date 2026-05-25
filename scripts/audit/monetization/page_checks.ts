/**
 * page_checks — v34 Phase 0Q stubs for the 11 page patterns.
 *
 * Every page-check returns PENDING for every gate during Phase 0Q.
 * As Phases A through E land, each function flips its gates to
 * GREEN / RED by inspecting the source tree (grep-style checks
 * against src/app and src/components).
 *
 * Pattern: each check is a pure function of the source tree on
 * disk — it does NOT need to render the page. This makes the
 * gate fast and runnable inside the prebuild hook.
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { GateResult, PageCheckResult, pending } from "./types";

const ROOT = resolve(process.cwd(), "src");

function readIfExists(rel: string): string | null {
  const abs = resolve(ROOT, rel);
  return existsSync(abs) ? readFileSync(abs, "utf-8") : null;
}

// ---------------------------------------------------------------------------
// Shared gate helpers — flip from PENDING to GREEN / RED as phases land.
// ---------------------------------------------------------------------------

/** Phase A check: do the lock primitives exist on disk? Once they
 * exist, every page's Gate A flips out of PENDING by default; per-page
 * checks then upgrade to GREEN / RED based on actual usage in Phase C. */
function phaseAPrimitivesShipped(): boolean {
  return (
    existsSync(resolve(ROOT, "components/monetization/index.ts")) &&
    existsSync(resolve(ROOT, "components/monetization/LockPill.tsx")) &&
    existsSync(resolve(ROOT, "components/monetization/BlurredOverlay.tsx")) &&
    existsSync(resolve(ROOT, "components/monetization/TruncatedTease.tsx")) &&
    existsSync(resolve(ROOT, "components/monetization/RedactedNumber.tsx")) &&
    existsSync(resolve(ROOT, "components/monetization/GhostBar.tsx"))
  );
}

function gateA_default(pageSource: string | null): GateResult {
  if (!phaseAPrimitivesShipped()) {
    return pending("Phase A primitives not yet on disk");
  }
  // Once primitives exist, a page either uses them (Phase C wiring) or
  // is explicitly marked as not requiring locks (e.g. /pricing, /about-data).
  // Until Phase C wires the specific page, we stay PENDING rather than
  // RED — the gate flips RED only when wiring is partial or broken.
  if (pageSource && pageSource.includes("@/components/monetization")) {
    return { status: "GREEN", message: "Phase A primitives in use on this page" };
  }
  return pending("Phase C has not yet wired this page");
}

function stub(pageId: string, pagePattern: string, pageSource: string | null = null): PageCheckResult {
  return {
    pageId,
    pagePattern,
    gates: {
      A_lock_primitives: gateA_default(pageSource),
      B_trust_copy: pending(),
      C_no_orphan_locks: pending(),
      D_no_leaked_values: pending(),
      E_four_thing_reveal: pending(),
    },
  };
}

// Each function intentionally calls stub() for now. Phase A onward
// replaces each one with a real implementation. The functions are
// kept separate (not a single generic) so each can grow its own
// page-specific rules without cross-contamination.

export function checkHome(): PageCheckResult {
  // Homepage stays editorial / inviting; no inline locks required.
  // Gate A flips GREEN if primitives exist on disk (homepage doesn't
  // need to import them, per v34 Part 5.1).
  const src = readIfExists("app/page.tsx");
  return stub("home", "/", src);
}

export function checkCell(): PageCheckResult {
  const src = readIfExists("app/[country]/[region]/[industry]/page.tsx");
  return stub("cell", "/{country}/{region}/{industry}", src);
}

export function checkIndustry(): PageCheckResult {
  const src = readIfExists("app/industries/[industry]/page.tsx");
  return stub("industry", "/industries/{industry}", src);
}

export function checkCity(): PageCheckResult {
  const src = readIfExists("app/cities/[city]/page.tsx");
  return stub("city", "/cities/{city}", src);
}

export function checkWorld(): PageCheckResult {
  const src = readIfExists("app/world/page.tsx");
  return stub("world", "/world", src);
}

export function checkCalculator(): PageCheckResult {
  const src = readIfExists("app/calculator/page.tsx");
  return stub("calculator", "/calculator", src);
}

export function checkCompare(): PageCheckResult {
  const src = readIfExists("app/compare/page.tsx");
  return stub("compare", "/compare", src);
}

export function checkPricing(): PageCheckResult {
  const src = readIfExists("app/pricing/page.tsx");
  return stub("pricing", "/pricing", src);
}

export function checkAboutData(): PageCheckResult {
  const src = readIfExists("app/about-data/page.tsx");
  return stub("about-data", "/about-data", src);
}

export function checkBlog(): PageCheckResult {
  const src = readIfExists("app/blog/[slug]/page.tsx");
  return stub("blog", "/blog/{slug}", src);
}

export function checkSector(): PageCheckResult {
  const src = readIfExists("app/sectors/[sector]/page.tsx");
  return stub("sector", "/sectors/{sector}", src);
}

export const ALL_CHECKS = [
  checkHome,
  checkCell,
  checkIndustry,
  checkCity,
  checkWorld,
  checkCalculator,
  checkCompare,
  checkPricing,
  checkAboutData,
  checkBlog,
  checkSector,
];
