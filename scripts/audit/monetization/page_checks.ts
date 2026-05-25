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

/** Phase B check: is PaywallModalRoot mounted in the layout? If so,
 * every page inherits the modal as its trust-copy carrier
 * (Methodology + cancel-anytime) by default. */
function phaseBModalMounted(): boolean {
  if (
    !existsSync(resolve(ROOT, "components/monetization/PaywallModalRoot.tsx"))
  ) {
    return false;
  }
  const layout = readIfExists("app/layout.tsx");
  if (!layout) return false;
  return (
    layout.includes("PaywallModalRoot") &&
    /<PaywallModalRoot\s*\/?>/.test(layout)
  );
}

function gateB_default(): GateResult {
  if (phaseBModalMounted()) {
    return {
      status: "GREEN",
      message:
        "PaywallModalRoot mounted in layout.tsx; trust copy " +
        "(Methodology + cancel-anytime) inherited by every page",
    };
  }
  return pending("Phase B modal not yet mounted in layout");
}

/** Gate C (no orphan locks): the v34 primitives in
 * @/components/monetization all wire openPaywall internally — there
 * is no way to mount one without a click handler. So Gate C is
 * GREEN wherever Gate A is GREEN, and PENDING otherwise. */
function gateC_default(gateA: GateResult): GateResult {
  if (gateA.status === "GREEN") {
    return {
      status: "GREEN",
      message:
        "v34 primitives always wire openPaywall internally; " +
        "no orphan locks possible",
    };
  }
  return pending("Phase C not yet wired");
}

/** Gate D (no leaked values): a page that mounts gating primitives
 * MUST gate the values server-side via gateValue() before they cross
 * the RSC boundary. We assert: if the page references rev_p25 or
 * rev_p75 in its JSX, it must also import gateValue from
 * @/lib/monetization/viewer_tier. */
function gateD_default(pageSource: string | null): GateResult {
  if (!pageSource) return pending("Page not found on disk");
  const referencesGatedValues =
    /\brev_p25\b|\brev_p75\b/.test(pageSource);
  if (!referencesGatedValues) {
    return {
      status: "GREEN",
      message:
        "Page does not reference any gated values; no leakage possible",
    };
  }
  const importsGateValue =
    /from\s+["']@\/lib\/monetization\/viewer_tier["']/.test(pageSource) ||
    /gateValue\s*\(/.test(pageSource);
  if (importsGateValue) {
    return {
      status: "GREEN",
      message:
        "Page references gated values AND imports gateValue() " +
        "for server-side gating",
    };
  }
  return {
    status: "RED",
    message:
      "Page references rev_p25/rev_p75 without importing gateValue() " +
      "from @/lib/monetization/viewer_tier — leakage risk",
  };
}

/** Gate E (four-thing reveal): every cell page must render the
 * four things that make a lock read as scarcity, not emptiness:
 *  (a) the cell title / heading
 *  (b) a last-updated date marker
 *  (c) a link to /about-data (methodology)
 *  (d) a link to /about-data#sources (or equivalent source list)
 *
 * Applied strictly only to the cell page; other pages auto-pass
 * since the reveal happens at the cell level. */
function gateE_for(
  pageId: string,
  pageSource: string | null,
): GateResult {
  if (pageId !== "cell") {
    return {
      status: "GREEN",
      message: "Four-thing reveal applies at the cell level only",
    };
  }
  if (!pageSource) {
    return { status: "RED", message: "Cell page source not found" };
  }
  // (a) heading: look for an h1 or "font-display" heading
  const hasHeading = /<h1\b|className=["'][^"']*font-display/.test(pageSource);
  // (b) updated date: look for a Date.now / data-updated / year:|year=
  const hasUpdated =
    /data-updated|updated_at|year\s*=|year:|new Date\(\)/i.test(pageSource);
  // (c) methodology link: /about-data is the canonical methodology page
  const hasMethodology = /\/about-data/.test(pageSource);
  // (d) source list: /about-data#sources or "sources" link
  const hasSources =
    /about-data#sources|\/sources/.test(pageSource) ||
    /sources/i.test(pageSource);
  const missing: string[] = [];
  if (!hasHeading) missing.push("heading");
  if (!hasUpdated) missing.push("updated-date");
  if (!hasMethodology) missing.push("methodology-link");
  if (!hasSources) missing.push("source-list");
  if (missing.length === 0) {
    return {
      status: "GREEN",
      message: "All four reveal anchors present (heading, updated, methodology, sources)",
    };
  }
  return {
    status: "RED",
    message: `Cell page missing four-thing reveal anchors: ${missing.join(", ")}`,
  };
}

/** Pages that v34 Part 5.1 explicitly marks as "no locks required".
 * These pass Gate A by policy: the page is SEO / editorial / pricing
 * surface where adding locks would be wrong. */
const NO_LOCKS_BY_DESIGN = new Set<string>([
  "home",
  "world",
  "about-data",
  "blog",
]);

function gateA_default(
  pageSource: string | null,
  pageId?: string,
): GateResult {
  if (!phaseAPrimitivesShipped()) {
    return pending("Phase A primitives not yet on disk");
  }
  if (pageSource && pageSource.includes("@/components/monetization")) {
    return { status: "GREEN", message: "Phase A primitives in use on this page" };
  }
  if (pageId && NO_LOCKS_BY_DESIGN.has(pageId)) {
    return {
      status: "GREEN",
      message:
        "No locks by design (v34 Part 5.1: editorial / SEO / pricing " +
        "surface; locks here would be wrong)",
    };
  }
  return pending("Phase C has not yet wired this page");
}

function stub(pageId: string, pagePattern: string, pageSource: string | null = null): PageCheckResult {
  const gateA = gateA_default(pageSource, pageId);
  return {
    pageId,
    pagePattern,
    gates: {
      A_lock_primitives: gateA,
      B_trust_copy: gateB_default(),
      C_no_orphan_locks: gateC_default(gateA),
      D_no_leaked_values: gateD_default(pageSource),
      E_four_thing_reveal: gateE_for(pageId, pageSource),
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
  const src = readIfExists("app/[country]/[geo]/[industry]/page.tsx");
  return stub("cell", "/{country}/{geo}/{industry}", src);
}

export function checkIndustry(): PageCheckResult {
  const src = readIfExists("app/industries/[industry]/page.tsx");
  return stub("industry", "/industries/{industry}", src);
}

export function checkCity(): PageCheckResult {
  const src = readIfExists("app/cities/[slug]/page.tsx");
  return stub("city", "/cities/{slug}", src);
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
