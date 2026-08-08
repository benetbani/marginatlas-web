#!/usr/bin/env node
/**
 * scripts/loop/sitemap.mjs , what the live sitemap actually declares.
 *
 * WHY THIS EXISTS. On 2026-08-08 two of the eight sitemap shards were found
 * shipping 110 bytes: zero URLs where hundreds belong. Those two are the CELL
 * pages, the deepest and most differentiated content on the site. The pages
 * themselves were live and fine, one of them 180KB. We simply were not telling
 * Google they existed, and nothing anywhere would ever have said so.
 *
 * THE MECHANISM, verified rather than assumed:
 *
 *   sitemap.ts reads its cell shards through
 *     withBudget(getTopCells(500), [], 20_000, "sitemap:usCells")
 *   a database read with a twenty-second budget and an EMPTY ARRAY fallback.
 *
 *   The fallback fired. Ruled out on the way: the suppression list holds one
 *   path and it is not a US one, and `/random` calls the same getTopCells at
 *   RUNTIME and redirects to a real cell, so the query works.
 *
 *   And it cannot self-heal. generateSitemaps output is prerendered at BUILD,
 *   so the empty shard is baked into the deployment; a cache-busted request
 *   still returns the same 110 bytes with an Age of thirteen hours. The code
 *   comment reasons that "the next healthy build refills it", which is true
 *   and useless on a site that once went two months without a deploy.
 *
 * An empty array is a sensible fallback almost everywhere: it renders nothing.
 * In a sitemap it is an active false statement, "there are no such pages".
 *
 * THIS IS A TOOL, NOT A GATE, DELIBERATELY. The failure is created by a
 * deploy, so a prebuild gate cannot see it; and making a database timeout fail
 * a production build is a deployment-policy decision that belongs to the
 * founder. Run it after a deploy.
 *
 *   node scripts/loop/sitemap.mjs
 *   node scripts/loop/sitemap.mjs --base https://staging.example.com
 *
 * Exit 1 if any shard declares zero URLs.
 */
const argv = process.argv.slice(2);
const baseArg = argv.indexOf("--base");
const BASE = baseArg > -1 ? argv[baseArg + 1] : "https://www.marginatlas.com";
const MAX_SHARDS = 24; // ids probed; the tail of empties is trimmed below

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

/** Git Bash rewrites a leading-slash argument into a Windows path. */
const unmangle = (a) => {
  const m = String(a).match(/^[A-Za-z]:[\\/](?:Program Files[\\/])?Git[\\/](.*)$/i);
  return m ? "/" + m[1].replace(/\\/g, "/") : a;
};

/* AN UNREGISTERED SHARD IS NOT A 404. The dispatcher in sitemap.ts ends with
   `return []`, so any id past the last registered one answers 200 with the same
   110-byte empty urlset as a shard whose read failed. Walking until a 404 never
   terminates, and every id past the end reads as a defect.
   So: probe a fixed range, then treat a RUN OF ZEROS AT THE TAIL as the
   dispatcher's default and ignore it. A zero shard only counts when a populated
   shard comes after it, which is what "registered but empty" looks like. */
const rows = [];
for (let i = 0; i < MAX_SHARDS; i++) {
  const url = `${unmangle(BASE)}/sitemap/${i}.xml`;
  try {
    const res = await fetch(url, { headers: { "user-agent": UA } });
    if (!res.ok) {
      rows.push({ i, locs: 0, bytes: 0, age: "-", http: res.status });
      continue;
    }
    const body = await res.text();
    rows.push({
      i,
      locs: (body.match(/<loc>/g) || []).length,
      bytes: body.length,
      age: res.headers.get("age") ?? "-",
    });
  } catch (e) {
    rows.push({ i, err: e.message });
  }
}

/* Trim the tail of empties: the highest index that declares anything is the
   last registered shard we can prove exists. */
let last = -1;
for (const r of rows) if (r.locs > 0) last = r.i;
const live = rows.filter((r) => r.i <= last);

if (live.length === 0) {
  console.error(`x sitemap: no shard at ${BASE} declares a single URL.`);
  process.exit(1);
}

console.log(`=== sitemap shards at ${BASE} ===`);
let total = 0;
const empty = [];
for (const r of live) {
  if (r.err) {
    console.log(`  shard ${r.i}  FETCH FAILED  ${r.err}`);
    continue;
  }
  total += r.locs;
  const flag = r.locs === 0 ? "  <-- DECLARES NOTHING" : "";
  console.log(
    `  shard ${String(r.i).padEnd(2)} ${String(r.locs).padStart(7)} urls  ` +
      `${String(r.bytes).padStart(9)} bytes  age ${String(r.age).padStart(7)}s${flag}`,
  );
  if (r.locs === 0) empty.push(r.i);
}
console.log(
  `  ${live.length} registered shard(s), ${total} URL(s) declared. ` +
    `Ids above ${last} answer empty and are read as unregistered.`,
);

/* A shard registered in generateSitemaps and emitting nothing is either dead
   code or a read that failed. Both are worth a human look; neither is normal. */
if (empty.length) {
  console.error(
    `\nx sitemap: shard(s) ${empty.join(", ")} declare zero URLs.\n` +
      `  A registered shard emitting nothing is a failed read or dead code.\n` +
      `  Check the withBudget fallbacks in src/app/sitemap.ts: an empty array\n` +
      `  there publishes "there are no such pages" rather than shipping thin.\n` +
      `  This is baked at build, so it will not recover without a deploy.`,
  );
  process.exit(1);
}

console.log("\n  All shards declare at least one URL.");
process.exit(0);
