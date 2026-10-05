/**
 * src/lib/spine/report.ts
 *
 * WHERE "REPORT A MISTAKE" GOES (milestone 2, masterplan step 31; QUEUE close:furniture-lines): the correction page, carrying the
 * reporting page's own path so the note says where the mistake is. Only a path on this site is ever carried, both ways: the foot
 * never builds a link with another host in it, and the correction page never echoes one back.
 */
export const REPORT_PAGE = "/corrections/new";

/** A path on this site: one leading slash, then letters, digits, hyphens, underscores, dots and slashes, at most 200 long. */
export function reportedPath(raw: unknown): string | null {
  const p = typeof raw === "string" ? raw : "";
  return p.length <= 200 && /^\/(?!\/)[\w\-./]*$/.test(p) ? p : null;
}

export function reportHref(path: string | null | undefined): string {
  const p = reportedPath(path);
  return p ? `${REPORT_PAGE}?page=${encodeURIComponent(p)}` : REPORT_PAGE;
}
