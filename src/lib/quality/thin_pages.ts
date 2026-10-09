/**
 * Render-layer suppression for thin pages.
 *
 * Loads `data/quality/thin_pages_v1.json` (produced by
 * `scripts/audit/page_fill_audit.ts`) at module init and exposes a
 * single `isPathSuppressed(path)` helper. Its one caller is
 * src/lib/cells/related_links.ts, which leaves a page that crawled empty
 * / missing-core out of a trade page's onward links so no page points a
 * reader at a half-empty one. The sitemaps do not read it: since P1-E
 * (2026-10-09) they list only the addresses indexFor admits
 * (src/lib/seo/sitemap_families.ts).
 *
 * Source data is never mutated; the suppression is a pure render-layer
 * decision and can be re-derived from a fresh audit run.
 */
// JSON-import the suppression list. The previous
// fs-based load chained through cells.ts into the Edge runtime, which
// webpack rejected. The JSON import is inlined at build time and works
// in both Node and Edge runtimes.
import thinPagesJson from "../../../data/quality/thin_pages_v1.json";

type ThinPagesFile = {
  generated_at: string;
  paths: string[];
};

let cache: { set: Set<string>; generatedAt: string } | null = null;

function load(): { set: Set<string>; generatedAt: string } {
  if (cache) return cache;
  const parsed = thinPagesJson as ThinPagesFile;
  cache = {
    set: new Set((parsed.paths || []).map((p) => p.toLowerCase())),
    generatedAt: parsed.generated_at || "",
  };
  return cache;
}

/**
 * Is `path` flagged as too thin to point a reader at?
 * Path comparison is case-insensitive.
 */
export function isPathSuppressed(path: string): boolean {
  if (!path) return false;
  return load().set.has(path.toLowerCase());
}

/** Total count of suppressed paths. */
export function suppressedPathCount(): number {
  return load().set.size;
}

/** ISO timestamp of the audit run that produced the current list. */
export function suppressedPathsGeneratedAt(): string {
  return load().generatedAt;
}
