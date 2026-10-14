/**
 * HomeContents, THE ATLAS AS A CONTENTS PAGE (plan 2026-10-13 home-quiet-editorial, Task 4B; spec docs/superpowers/specs/
 * 2026-10-13-home-quiet-editorial-design.md, section 2, item 3, and section 3): one wide zone's content, six numbered departments on a grid
 * of its own: one column on a phone, two from 768, two rows of three from 1024, hairlines between them with 32 of air either side of each.
 * Each department is a section card (a Box with its id, so the page laws read six sections and the home clears its block floor) standing
 * open on the zone, drawn by the Department form. THE SIX ARE WRITTEN OUT, NOT MAPPED: the section census (scripts/harness/census.ts) and
 * the archetype coverage gate read a Box's id and its archetype from the source, so each Box is its own line. The marks: a flag
 * (CountryFlag), the city's small photograph in grey with no wash (DuotonePhoto from CityParts.tsx, a server module), a trade pictogram or
 * a site icon in ink2 (`ma-mono`: no terracotta accent inside a glyph).
 */
import * as React from "react";
import { Box } from "@/components/spine/kit";
import { Department, type DepartmentRow } from "@/components/spine/archetypes/Department";
import { DuotonePhoto } from "@/components/spine/archetypes/CityParts";
import { CountryFlag } from "@/components/CountryFlag";
import { AtlasIcon } from "@/components/brand/icons";
import { AtlasPictogram } from "@/components/brand/pictograms";
import type { Contents, DepartmentKey, MemberMark } from "@/lib/home/contents";
import { COPY } from "@/lib/spine/copy";

/** The small copies' own size (scripts/build_city_images_manifest.ts --thumbs), so the browser keeps the picture's box before it decodes. */
const THUMB_W = 480;
const THUMB_H = 360;
const GRID = "grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-12 lg:grid-cols-3 lg:gap-x-16 [&>*+*]:border-t [&>*+*]:border-[var(--c-border)] [&>*+*]:pt-8 [&>*:nth-child(2)]:md:border-t-0 [&>*:nth-child(2)]:md:pt-0 [&>*:nth-child(3)]:lg:border-t-0 [&>*:nth-child(3)]:lg:pt-0";

function Mark({ mark }: { mark: MemberMark }) {
  if (mark.kind === "flag") return <CountryFlag iso2={mark.iso2} />;
  if (mark.kind === "photo")
    return (
      <span className="relative block h-7 w-10 overflow-hidden rounded-[8px] [&>[data-veil]]:hidden">
        <DuotonePhoto src={mark.src} placeholder={false} tint={false} position={mark.position} width={THUMB_W} height={THUMB_H} />
      </span>
    );
  if (mark.kind === "pictogram") return <AtlasPictogram id={mark.id} size={24} className="ma-mono text-[var(--c-ink2)]" />;
  return <AtlasIcon id={mark.id} size={20} className="ma-mono text-[var(--c-ink2)]" />;
}

export function HomeContents({ contents }: { contents: Contents }) {
  const dept = (key: DepartmentKey) => {
    const d = contents[key];
    const rows: DepartmentRow[] = d.members.map((m) => ({ key: m.key, href: m.href, name: m.name, mark: <Mark mark={m.mark} />, figure: m.figure ? { text: m.figure.text, unit: COPY.home.contents.unit, prov: m.figure.prov } : null }));
    return { dept: d.key, index: d.index, title: d.title, line: d.line, rows, door: d.door };
  };
  return (
    <div data-contents="" className={GRID}>
      <div data-contents-cell="" className="min-w-0">
        <Box id="dept-countries" className="flex flex-col">
          <Department {...dept("countries")} />
        </Box>
      </div>
      <div data-contents-cell="" className="min-w-0">
        <Box id="dept-cities" className="flex flex-col">
          <Department {...dept("cities")} />
        </Box>
      </div>
      <div data-contents-cell="" className="min-w-0">
        <Box id="dept-trades" className="flex flex-col">
          <Department {...dept("trades")} />
        </Box>
      </div>
      <div data-contents-cell="" className="min-w-0">
        <Box id="dept-tools" className="flex flex-col">
          <Department {...dept("tools")} />
        </Box>
      </div>
      <div data-contents-cell="" className="min-w-0">
        <Box id="dept-reading" className="flex flex-col">
          <Department {...dept("reading")} />
        </Box>
      </div>
      <div data-contents-cell="" className="min-w-0">
        <Box id="dept-method" className="flex flex-col">
          <Department {...dept("method")} />
        </Box>
      </div>
    </div>
  );
}
