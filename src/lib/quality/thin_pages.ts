/**
 * Plan v24 Block 5 — render-layer suppression for thin pages.
 *
 * Loads `data/quality/thin_pages_v1.json` (produced by
 * `scripts/audit/page_fill_audit.ts`) at module init and exposes a
 * single `isPathSuppressed(path)` helper. Used by the sitemap to skip
 * URLs that crawled empty / missing-core sections so we never advertise
 * a half-empty page to search engines.
 *
 * Source data is never mutated; the suppression is a pure render-layer
 * decision and can be re-derived from a fresh audit run.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

type ThinPagesFile = {
  generated_at: string;
  paths: string[];
};

let cache: { set: Set<string>; generatedAt: string } | null = null;

function load(): { set: Set<string>; generatedAt: string } {
  if (cache) return cache;
  const path = resolve(process.cwd(), "data", "quality", "thin_pages_v1.json");
  if (!existsSync(path)) {
    cache = { set: new Set(), generatedAt: "" };
    return cache;
  }
  try {
    const parsed = JSON.parse(readFileSync(path, "utf-8")) as ThinPagesFile;
    cache = {
      set: new Set((parsed.paths || []).map((p) => p.toLowerCase())),
      generatedAt: parsed.generated_at || "",
    };
  } catch {
    cache = { set: new Set(), generatedAt: "" };
  }
  return cache;
}

/**
 * Is `path` flagged as too thin to advertise from the sitemap?
 * Path comparison is case-insensitive.
 */
export function isPathSuppressed(path: string): boolean {
  if (!path) return false;
  return load().set.has(path.toLowerCase());
}

/** Total count of suppressed paths (for sitemap reporting). */
export function suppressedPathCount(): number {
  return load().set.size;
}

/** ISO timestamp of the audit run that produced the current list. */
export function suppressedPathsGeneratedAt(): string {
  return load().generatedAt;
}
