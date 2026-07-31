/**
 * scripts/verify_district_geometry.ts
 *
 * A DISTRICT IN THE WRONG PLACE IS SILENTLY WRONG.
 *
 * Every other kind of bad data on this site announces itself: a missing figure
 * renders a stated gap, a broken band fails a gate, a wrong number looks odd
 * beside its neighbours. A wrong coordinate does none of that. The page renders
 * perfectly, the map draws a marker, and it sits in the North Sea. The single
 * commonest way this happens is a dropped or flipped longitude sign, which
 * moves a London district to the far side of the Atlantic while both numbers
 * still look entirely reasonable in isolation.
 *
 * So the check is relative rather than absolute. We do not hold a boundary for
 * any city, and hardcoding a bounding box per city would be a second dataset to
 * maintain and get wrong. Instead: **the districts of one city must be near each
 * other.** That is true by construction, since they are named commercial
 * districts of a single city, and it catches the sign flip, the transposed
 * lat/lng pair, and the copy-paste from another city, without needing to know
 * where any city actually is.
 *
 * WHAT IT CHECKS:
 *   1. Every district has a centre with finite, in-range coordinates.
 *   2. No two districts share a point. Identical coordinates mean a copy-paste
 *      that was never finished, and the map would stack markers invisibly.
 *   3. Every district sits within a sane radius of the city's own median point.
 *   4. Nothing is at exactly 0,0. Null Island is what a missing value looks
 *      like once it has been coerced to a number.
 *
 * Usage: npx tsx scripts/verify_district_geometry.ts
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * How far a district may sit from its city's median district, in kilometres.
 * Generous on purpose: Greater London spans roughly 60km east to west, and a
 * city like Los Angeles is wider still. This is a sanity bound that catches
 * hemisphere errors, not a cartographic standard.
 */
const MAX_KM_FROM_MEDIAN = 120;

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

const failures: string[] = [];

function cityFiles(): string[] {
  const out: string[] = [];
  for (const dir of ["fixtures", "data/cities"]) {
    const abs = resolve(process.cwd(), dir);
    if (!existsSync(abs)) continue;
    for (const n of readdirSync(abs)) if (n.endsWith(".json")) out.push(resolve(abs, n));
  }
  return out;
}

let checked = 0;

for (const file of cityFiles()) {
  let doc: Record<string, unknown>;
  try {
    doc = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    continue;
  }
  const districts = doc.districts as Record<string, unknown> | undefined;
  const list = districts?.list as Record<string, unknown> | undefined;
  const rows = (list?.districts as Array<Record<string, unknown>>) ?? [];
  if (!rows.length) continue;
  const rel = file.replace(process.cwd(), "").replace(/\\/g, "/").replace(/^\//, "");
  checked++;

  const pts: Array<{ slug: string; lat: number; lng: number }> = [];

  for (const r of rows) {
    const slug = String(r.slug);
    const c = r.centre as { lat?: unknown; lng?: unknown } | undefined;
    if (!c || typeof c.lat !== "number" || typeof c.lng !== "number") {
      failures.push(`${rel}: district "${slug}" has no usable centre. The map cannot place it.`);
      continue;
    }
    const { lat, lng } = c as { lat: number; lng: number };
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      failures.push(`${rel}: district "${slug}" centre ${lat},${lng} is out of range.`);
      continue;
    }
    if (lat === 0 && lng === 0) {
      failures.push(
        `${rel}: district "${slug}" sits at 0,0. That is what a missing value looks like\n` +
          `      once it has been coerced to a number, not a place in this city.`,
      );
      continue;
    }
    pts.push({ slug, lat, lng });
  }

  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      if (pts[i].lat === pts[j].lat && pts[i].lng === pts[j].lng) {
        failures.push(
          `${rel}: "${pts[i].slug}" and "${pts[j].slug}" share the same point. The map would\n` +
            `      stack one marker invisibly on the other.`,
        );
      }
    }
  }

  if (pts.length >= 2) {
    const centre = { lat: median(pts.map((p) => p.lat)), lng: median(pts.map((p) => p.lng)) };
    for (const p of pts) {
      const km = haversineKm(p, centre);
      if (km > MAX_KM_FROM_MEDIAN) {
        failures.push(
          `${rel}: district "${p.slug}" is ${Math.round(km)}km from the median district of its\n` +
            `      own city. Districts of one city are near each other by construction, so this\n` +
            `      is usually a flipped longitude sign or a transposed lat/lng pair.`,
        );
      }
    }
  }
}

if (failures.length) {
  console.error(`x verify_district_geometry: ${failures.length} problem(s).\n`);
  for (const f of failures) console.error("   " + f);
  process.exit(1);
}

console.log(`verify_district_geometry: PASS. ${checked} city file(s) placed.`);
