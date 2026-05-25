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
import { PageCheckResult, pending } from "./types";

const ROOT = resolve(process.cwd(), "src");

function readIfExists(rel: string): string | null {
  const abs = resolve(ROOT, rel);
  return existsSync(abs) ? readFileSync(abs, "utf-8") : null;
}

function stub(pageId: string, pagePattern: string): PageCheckResult {
  return {
    pageId,
    pagePattern,
    gates: {
      A_lock_primitives: pending(),
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
  // Touch the file so the function is not dead during Phase 0Q.
  // When Phase B lands, the trust check looks for
  // /about-data link inside the data-confidence band.
  readIfExists("app/page.tsx");
  return stub("home", "/");
}

export function checkCell(): PageCheckResult {
  readIfExists("app/[country]/[region]/[industry]/page.tsx");
  return stub("cell", "/{country}/{region}/{industry}");
}

export function checkIndustry(): PageCheckResult {
  readIfExists("app/industries/[industry]/page.tsx");
  return stub("industry", "/industries/{industry}");
}

export function checkCity(): PageCheckResult {
  readIfExists("app/cities/[city]/page.tsx");
  return stub("city", "/cities/{city}");
}

export function checkWorld(): PageCheckResult {
  readIfExists("app/world/page.tsx");
  return stub("world", "/world");
}

export function checkCalculator(): PageCheckResult {
  readIfExists("app/calculator/page.tsx");
  return stub("calculator", "/calculator");
}

export function checkCompare(): PageCheckResult {
  readIfExists("app/compare/page.tsx");
  return stub("compare", "/compare");
}

export function checkPricing(): PageCheckResult {
  readIfExists("app/pricing/page.tsx");
  return stub("pricing", "/pricing");
}

export function checkAboutData(): PageCheckResult {
  readIfExists("app/about-data/page.tsx");
  return stub("about-data", "/about-data");
}

export function checkBlog(): PageCheckResult {
  readIfExists("app/blog/[slug]/page.tsx");
  return stub("blog", "/blog/{slug}");
}

export function checkSector(): PageCheckResult {
  readIfExists("app/sectors/[sector]/page.tsx");
  return stub("sector", "/sectors/{sector}");
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
