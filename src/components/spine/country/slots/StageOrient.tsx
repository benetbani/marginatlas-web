/**
 * STAGE 1, ORIENT (plan 2026-10-13 country-page-journey, Task 3B; spec section 2: "What is this country like for a small business?"): his
 * masthead (HeroBoard, his design of 2026-09-20), its answer column slot 1 (the tax on profit) and its column of placed figures slot 2.
 */
import * as React from "react";
import { HeroBoard } from "@/components/spine/archetypes/HeroBoard";
import { buildHeroBoard } from "@/lib/spine/hero_board";
import { SURFACE_ANSWERS } from "@/lib/spine/door_kinds";

export function MastheadSlots({ iso2 }: { iso2: string }) {
  return <HeroBoard id="take" board={buildHeroBoard(iso2)} answers={SURFACE_ANSWERS.country} slotted />;
}
