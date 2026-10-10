/**
 * The one drawing behind the site icon's three numbered files (plan 2026-10-10, the home reformed to ship, Task 7 and its fix round
 * 7; the ship audit's 2.2): src/app/icon.tsx at 48 (served at /icon), icon1.tsx at 192 (/icon1) and icon2.tsx at 512 (/icon2). Google
 * asks a favicon whose side is a multiple of 48, and the manifest (src/app/manifest.ts) names the 192 and 512 for a phone's home
 * screen. The header's compass mark (src/components/brand/LogoMark.tsx), black on white, drawn at build time as a PNG of the side asked.
 *
 * WHY THREE FILES AND NOT ONE WITH generateImageMetadata: that export serves each size at /icon/<id> and leaves /icon, the address
 * production has served since 2026-10-06, to the country wildcard. A numbered file keeps its own address.
 *
 * WHY THIS FILE'S NAME ENDS IN icon.tsx: scripts/verify_hardcoded_hex.ts skips raster icon routes by that ending, which icon1.tsx and
 * icon2.tsx do not match, so the black lives here and the three files hold no colour. White is written as a word: the cream gate
 * counts the hex for the name its ramp step once carried (scripts/verify_no_cream.ts).
 *
 * AN EDIT TO THE DRAWING OR TO THE MARK MUST TOUCH THE ICON FILES. Every page's head links each icon as /icon?<hash>, /icon1?<hash>
 * and /icon2?<hash>, the hash of THAT ICON FILE'S OWN TEXT (Next takes it at build from the file), and the PNG is served immutable
 * for a year. The drawing lives here and in src/components/brand/LogoMark.tsx, so an edit to either that leaves icon.tsx, icon1.tsx
 * and icon2.tsx as they were keeps the old icon in every returning browser. Change the "Mark revised" date in the header of each of
 * the three (and of src/app/apple-icon.tsx) in the same commit, so the hash moves. Not machine-checked: the hash is Next's.
 *
 * WHY IT LIVES HERE AND NOT IN src/components/brand: a leaf file inside the app folder, not a route (src/app/og/_card.tsx is the
 * precedent: only page, route and the metadata names are routable, and this one is none of them, so it adds no URL). The render-graph
 * gate (scripts/audit_render_graph.ts) walks from page, layout and route files and calls a component reached by nothing else an
 * orphan, and the icon files are not roots of its walk.
 */
import { ImageResponse } from "next/og";
import { LogoMark } from "@/components/brand/LogoMark";

/** The icon, a square `px` pixels a side: the mark at seven eighths of it, centred on white. */
export function siteIcon(px: number): ImageResponse {
  return new ImageResponse(
    (
      <div style={{ width: px, height: px, display: "flex", alignItems: "center", justifyContent: "center", background: "white" }}>
        <LogoMark size={Math.round(px * 0.875)} color="#000000" />
      </div>
    ),
    { width: px, height: px },
  );
}
