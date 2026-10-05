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

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { stripCommentLines } from "../../lib/strip_comments";
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

/* Gate B (no pop-up; masterplan step 13). Until 2026-10-05 this gate was GREEN only while PaywallModalRoot was mounted in the
 * layout, and PENDING, which passes, once it was not: a check that passes either way says nothing. Inverted, it proves the
 * absence his ruling asks for, and names what it found otherwise. It reads every layout under src/app (what wraps a page) and
 * every monetization component (what a lock is built from), comments stripped. Blind spot: it reads source, not renders, so a
 * dialog mounted by a component those files import under a plain name is not seen; the copy gates and photographs cover the
 * pages themselves. */
const RULING_22 = "his ruling 22 of 2026-09-26: a locked section opens no pop-up";

const POPUP_SIGNS: { sign: string; re: RegExp }[] = [
  /* A JSX tag follows a space, a bracket or a line start; a type argument (useState<ModalState>) follows a name. */
  { sign: "a modal or dialog component", re: /(?:^|[^\w.])<(?:[A-Z]\w*)?(?:Modal|Dialog)\w*[\s/>]/m },
  { sign: 'role="dialog"', re: /role\s*=\s*\{?\s*["'`]dialog["'`]/ },
  { sign: "aria-modal", re: /aria-modal/ },
  { sign: "a dialog element", re: /<dialog[\s/>]/ },
];

function filesUnder(rel: string, keep: (name: string) => boolean): string[] {
  const abs = resolve(ROOT, rel);
  if (!existsSync(abs)) return [];
  const out: string[] = [];
  for (const name of readdirSync(abs)) {
    const child = `${rel}/${name}`;
    if (statSync(resolve(ROOT, child)).isDirectory()) out.push(...filesUnder(child, keep));
    else if (keep(name)) out.push(child);
  }
  return out;
}

function popupsMounted(): string[] {
  const files = [
    ...filesUnder("app", (name) => name === "layout.tsx"),
    ...filesUnder("components/monetization", (name) => /\.tsx?$/.test(name)),
  ];
  const found: string[] = [];
  for (const rel of files) {
    const src = readIfExists(rel);
    if (!src) continue;
    const code = stripCommentLines(src.split(/\r?\n/)).join("\n");
    for (const { sign, re } of POPUP_SIGNS) {
      if (re.test(code)) found.push(`src/${rel}: ${sign}`);
    }
  }
  return found;
}

function gateB_default(): GateResult {
  const found = popupsMounted();
  if (found.length === 0) {
    return {
      status: "GREEN",
      message: `No modal root or dialog in a layout or a monetization component (${RULING_22})`,
    };
  }
  return {
    status: "RED",
    message: `A pop-up is mounted (${RULING_22})`,
    evidence: found.join("; "),
  };
}

/* Gate C (no orphan locks; masterplan step 13). Every lock primitive is a link to the pricing page, so no lock can be mounted
 * that goes nowhere, and none dispatches an opener: since the pop-up left, an opener has nothing listening for it. */
const LOCK_PRIMITIVES = ["LockPill", "BlurredOverlay", "TruncatedTease", "RedactedNumber", "GhostBar"];

function locksNotLinked(): string[] {
  const out: string[] = [];
  for (const name of LOCK_PRIMITIVES) {
    const src = readIfExists(`components/monetization/${name}.tsx`);
    if (!src) continue; // gate A reports a missing primitive
    const code = stripCommentLines(src.split(/\r?\n/)).join("\n");
    if (!/href=\{PRICING_HREF\}/.test(code)) out.push(`${name}.tsx: no link to PRICING_HREF`);
    if (/openPaywall|dispatchEvent/.test(code)) out.push(`${name}.tsx: dispatches an opener`);
  }
  return out;
}

function gateC_default(gateA: GateResult): GateResult {
  if (gateA.status !== "GREEN") return pending("Phase C not yet wired");
  const bad = locksNotLinked();
  if (bad.length === 0) {
    return { status: "GREEN", message: "Every lock primitive is a link to /pricing and none opens a pop-up" };
  }
  return { status: "RED", message: "A lock primitive goes nowhere", evidence: bad.join("; ") };
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

function stub(pageId: string, pagePattern: string, pageSource: string | null = null, sourceFile?: string): PageCheckResult {
  const gateA = gateA_default(pageSource, pageId);
  return {
    pageId,
    pagePattern,
    sourceFile,
    gates: {
      A_lock_primitives: gateA,
      B_no_popup: gateB_default(),
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
  const rel = "app/page.tsx";
  return stub("home", "/", readIfExists(rel), `src/${rel}`);
}

export function checkCell(): PageCheckResult {
  const rel = "app/[country]/[geo]/[industry]/page.tsx";
  return stub("cell", "/{country}/{geo}/{industry}", readIfExists(rel), `src/${rel}`);
}

export function checkIndustry(): PageCheckResult {
  const rel = "app/(site)/industries/[industry]/page.tsx";
  return stub("industry", "/industries/{industry}", readIfExists(rel), `src/${rel}`);
}

export function checkCity(): PageCheckResult {
  const rel = "app/(site)/cities/[slug]/page.tsx";
  return stub("city", "/cities/{slug}", readIfExists(rel), `src/${rel}`);
}

export function checkWorld(): PageCheckResult {
  const rel = "app/(site)/world/page.tsx";
  return stub("world", "/world", readIfExists(rel), `src/${rel}`);
}

export function checkCalculator(): PageCheckResult {
  const rel = "app/(site)/calculator/page.tsx";
  return stub("calculator", "/calculator", readIfExists(rel), `src/${rel}`);
}

export function checkCompare(): PageCheckResult {
  const rel = "app/(site)/compare/page.tsx";
  return stub("compare", "/compare", readIfExists(rel), `src/${rel}`);
}

export function checkPricing(): PageCheckResult {
  const rel = "app/(site)/pricing/page.tsx";
  return stub("pricing", "/pricing", readIfExists(rel), `src/${rel}`);
}

export function checkAboutData(): PageCheckResult {
  const rel = "app/(site)/about-data/page.tsx";
  return stub("about-data", "/about-data", readIfExists(rel), `src/${rel}`);
}

export function checkBlog(): PageCheckResult {
  const rel = "app/(site)/blog/[slug]/page.tsx";
  return stub("blog", "/blog/{slug}", readIfExists(rel), `src/${rel}`);
}

export function checkSector(): PageCheckResult {
  const rel = "app/sectors/[sector]/page.tsx";
  return stub("sector", "/sectors/{sector}", readIfExists(rel), `src/${rel}`);
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
