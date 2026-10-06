/**
 * src/lib/routing/names_file.ts
 *
 * ONE DEFINITION OF A FILE (2026-10-06). The last part of the address has a dot in it: the address names a file, not a page. No
 * page or API address the site serves has one (tests/routing/edge_not_found.test.ts holds every slug and API folder dotless), so
 * the edge answers every dotted address public/ does not serve with a 404 (edge_not_found.ts), and the session refresh never runs
 * for one (src/lib/supabase/middleware_session.ts): a real photograph and a made-up file alike cost no Supabase call. Both read
 * this one rule, so the two can never disagree about what a file is.
 */
export function namesFile(path: string): boolean {
  return (String(path ?? "").split("/").filter(Boolean).pop() ?? "").includes(".");
}
