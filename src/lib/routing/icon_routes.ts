/**
 * src/lib/routing/icon_routes.ts
 *
 * THE SITE'S ICON ROUTES, ONE LIST (cleanup round 2 of the plan 2026-10-10, the home reformed to ship; the fix round 7 list moved out
 * of src/middleware.ts). The metadata files src/app/icon.tsx, icon1.tsx, icon2.tsx and apple-icon.tsx are served at /icon, /icon1,
 * /icon2 and /apple-icon. Their addresses have no dot, so SERVED_FILES (the dotted files) cannot hold them and the dotted-file rule
 * (src/lib/routing/names_file.ts) does not see them. Like the manifest they are files a browser asks for, not pages, so:
 *   - the middleware passes them untouched, first, and never counts them against the rate limit (src/middleware.ts);
 *   - the session refresh never runs for them (src/lib/supabase/middleware_session.ts): with accounts on it asked Supabase once for
 *     each of the four that every signed-in reader's page links.
 * Both read this one set. Exact addresses, not a pattern, so a made-up /icon7 still meets the 404 for a place the site does not hold.
 * tests/routing/metadata_routes.test.ts asks every such file src/app holds, so an icon file added without an entry here reds there.
 *
 * WHY ITS OWN MODULE: the middleware imports the session refresh, and the refresh importing the middleware would be a cycle.
 */
export const ICON_ROUTES: ReadonlySet<string> = new Set(["/icon", "/icon1", "/icon2", "/apple-icon"]);
