"use client";
/**
 * HomeAsk, THE QUESTION AND THE PICKER ON ONE INDEX (plan 2026-10-13 home-quiet-editorial, Task 3; spec docs/superpowers/specs/
 * 2026-10-13-home-quiet-editorial-design.md, section 2, item 2). His h1, its two words on HeroWords' one timer, and under it the picker,
 * which follows the h1's case: HeroWords tells the index on screen (onIndex) and NavigatorForm shows `cases[index]` until the reader
 * reaches it. The h1's classes and the picker's wrapper are the ones home-view.tsx drew before this file (32 from the h1 to the picker from
 * 1024, 16 on a phone). The cases come from the server (src/lib/home/picker_cases.ts) as data; this file imports the picker's types only,
 * so the lists still load on first use.
 */
import * as React from "react";
import { HeroWords } from "./HeroWords";
import { NavigatorForm } from "@/components/NavigatorForm";
import type { PickerSeed } from "@/lib/home/picker";

export function HomeAsk({ lead, middle, businesses, cities, cases }: { lead: string; middle: string; businesses: readonly string[]; cities: readonly string[]; cases: ReadonlyArray<PickerSeed | null> }) {
  const [at, setAt] = React.useState(0);
  return (
    <>
      <h1 className="font-display text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[var(--c-ink)] leading-[1.08]">
        <HeroWords lead={lead} middle={middle} businesses={businesses} cities={cities} onIndex={setAt} />
      </h1>
      <div className="relative z-30 mt-4 lg:mt-8 w-full">
        <NavigatorForm showHeading={false} cases={cases} caseIndex={at} />
      </div>
    </>
  );
}
