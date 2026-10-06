/**
 * scripts/lib/metadata_routes.mjs
 *
 * Every metadata route file under src/app, and the address Next serves it at, computed by Next's own functions (2026-10-06).
 *
 * WHY IT EXISTS. src/app/icon.tsx is a FILE, and Next serves it at /icon: one part, no dot. The list the middleware reads to
 * tell a real first segment from a made-up one (src/lib/routing/top_level_segments.ts) was walked from route FOLDERS, so
 * "icon" was never in it, and src/middleware.ts pinned /icon to 404 with the icon's own PNG as the body. Every page links it
 * as the site icon, and a browser refuses a favicon that answers 404 (production, 2026-10-06: 404, image/png, 924 bytes,
 * matched path /icon).
 *
 * NO ADDRESS IS RETYPED HERE. Each step is the function Next's build runs, in the order it runs them (createPagesMapping in
 * next/dist/build/entries.js): the page key, then normalizeMetadataRoute (robots gains .txt, manifest .webmanifest, and a
 * file inside a route group or a parallel route a six-character suffix: `(site)/opengraph-image.tsx` serves at
 * `/opengraph-image-<suffix>`), then normalizeMetadataPageToRoute (a file exporting generateImageMetadata or
 * generateSitemaps serves one address per id), then normalizeAppPath (groups and the `/route` tail go).
 *
 * WHAT IT CANNOT SEE. Next finds those two exports by parsing the file; this reads them with a pattern, so an unusual export
 * form is missed, and then only the id part of the address is lost (`/icon` for `/icon/<id>`), never its first segment. It
 * takes Next's default page extensions: next.config.js sets none, and the walk throws the day it does.
 *
 *   import { metadataRoutes, requestedAddress } from "./lib/metadata_routes.mjs";
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { isMetadataRouteFile, STATIC_METADATA_IMAGES } = require("next/dist/lib/metadata/is-metadata-route.js");
const { normalizeMetadataRoute, normalizeMetadataPageToRoute } = require("next/dist/lib/metadata/get-metadata-route.js");
const { normalizeAppPath } = require("next/dist/shared/lib/router/utils/app-paths.js");

/** Next's names for the image conventions: icon, apple-icon, favicon, opengraph-image, twitter-image.
 *  @type {string[]} */
export const METADATA_IMAGE_NAMES = Object.values(STATIC_METADATA_IMAGES).map((m) => m.filename);

/** Next's default page extensions; next.config.js sets no `pageExtensions` (metadataRoutes checks). */
const PAGE_EXTENSIONS = ["tsx", "ts", "jsx", "js"];
const STRIP_EXTENSION = new RegExp(`\\.+(${PAGE_EXTENSIONS.join("|")})$`);
/** The part Next gives a route that serves one address per id. */
const ID = "[__metadata_id__]";
const SERVES_PER_ID = /\bexport\s+(?:async\s+)?function\s+(?:generateImageMetadata|generateSitemaps)\b|\bexport\s+(?:const|let|var)\s+(?:generateImageMetadata|generateSitemaps)\b|\bexport\s*\{[^}]*\b(?:generateImageMetadata|generateSitemaps)\b/;

/**
 * The address Next serves a file at, or null when the file is no metadata route.
 * @param {string} rel the file's path under src/app, leading slash, forward slashes: `/icon.tsx`
 * @param {boolean} [perId] the file exports generateImageMetadata or generateSitemaps
 * @returns {string | null} `/icon`, `/robots.txt`, `/sitemap/[__metadata_id__]`
 */
export function metadataAddress(rel, perId = false) {
  if (!isMetadataRouteFile(rel, PAGE_EXTENSIONS, true)) return null;
  // getPageFromPath and the app-dir step of createPagesMapping (next/dist/build/entries.js), line for line.
  let page = rel.replace(STRIP_EXTENSION, "").replace(/\/index$/, "").replace(/%5F/g, "_");
  if (page === "") page = "/";
  return normalizeAppPath(normalizeMetadataPageToRoute(normalizeMetadataRoute(page), perId));
}

/**
 * Every metadata route file under `appDir`, with its address; a private `_folder` and everything in it is not routed.
 * @param {string} [appDir]
 * @returns {{ file: string, address: string }[]} sorted by file
 */
export function metadataRoutes(appDir = "src/app") {
  if (/\bpageExtensions\b/.test(fs.readFileSync("next.config.js", "utf8"))) {
    throw new Error("next.config.js sets pageExtensions: teach scripts/lib/metadata_routes.mjs the new list (it takes Next's default)");
  }
  const out = [];
  const walk = (dir, rel) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const r = `${rel}/${e.name}`;
      if (e.isDirectory()) {
        if (!e.name.startsWith("_")) walk(path.join(dir, e.name), r);
        continue;
      }
      if (!isMetadataRouteFile(r, PAGE_EXTENSIONS, true)) continue;
      const perId = SERVES_PER_ID.test(fs.readFileSync(path.join(dir, e.name), "utf8"));
      out.push({ file: `${appDir}${r}`, address: /** @type {string} */ (metadataAddress(r, perId)) });
    }
  };
  walk(appDir, "");
  return out.sort((a, b) => a.file.localeCompare(b.file));
}

/**
 * The address a request carries, the id part filled the way Next's loader reads it
 * (next/dist/build/webpack/loaders/next-metadata-route-loader.js): a sitemap's id ends in .xml (`/sitemap/0.xml`, and one
 * without it is Next's own 404), an image's is bare (`/icon/0`). Any other address is returned as it is.
 * @param {string} address
 * @param {string} [id]
 * @returns {string}
 */
export function requestedAddress(address, id = "0") {
  if (!address.endsWith(`/${ID}`)) return address;
  const base = address.slice(0, -ID.length);
  return `${base}${base.endsWith("/sitemap/") ? `${id}.xml` : id}`;
}
