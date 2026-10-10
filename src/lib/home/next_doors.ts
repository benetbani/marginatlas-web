/**
 * src/lib/home/next_doors.ts
 *
 * WHERE TO NEXT, THE SITE'S WAYS OUT (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Task 5; the home's spec of
 * 2026-10-09, section 6, approved as written: "'Where to next' holds eight doors (DRAFT): The United Kingdom, Every country, Every
 * city, Every trade, Where new businesses open, Free UK data, About the figures, From the notebook"). Each door a page that exists (the links walk
 * holds every address to a route); the words are the copy table's (COPY.home.next). No count on any door (his ruling of 2026-10-07).
 * `nextDoors(path)` leaves out the page the reader is on. Since plan 2026-10-10 (the home reformed to ship, Task 6; the spec's
 * decision 5, the critique's P2.7) the last door reads "From the blog", the name the nav, the footer and the page give /blog.
 */
import { COPY } from "@/lib/spine/copy";

export type NextDoor = { key: string; label: string; href: string };

const DOORS: ReadonlyArray<{ key: keyof typeof COPY.home.next.doors; href: string }> = [
  { key: "uk", href: "/gb" },
  { key: "countries", href: "/countries" },
  { key: "cities", href: "/cities" },
  { key: "trades", href: "/industries" },
  { key: "openings", href: "/new-businesses" },
  { key: "data", href: "/data" },
  { key: "about", href: "/about-data" },
  { key: "blog", href: "/blog" },
];

/** The doors in their order, less the page at `except`. */
export function nextDoors(except: string | null = null): NextDoor[] {
  return DOORS.filter((d) => d.href !== except).map((d) => ({ key: d.key, label: COPY.home.next.doors[d.key], href: d.href }));
}
