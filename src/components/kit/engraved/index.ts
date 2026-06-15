/**
 * kit/engraved — the engraved-almanac foundation for the country page.
 *
 * The shared cartographic vocabulary every engraved country-page section
 * composes from: the meaning scale, the compass rosette, the contour field, the
 * surveyor's route line, the one-colour glyph set, the council stamp seal, the
 * eyebrow + honest sample state, and the two flagship assets (the engraved hero
 * band + the 8-metric scorecard). Ported from the design export
 * 2026-06-14-country-engraved.
 *
 * Tokens via the engraved CSS-variable layer in globals.css, nullable inputs,
 * honest sample states, no raw hex in the .tsx, no em-dashes, no source-agency
 * names. A later wave wires these into the country page; this is only the kit.
 */

// Primitives + the meaning scale
export {
  meaningStep,
  ENGRAVED_MEANING,
  type MeaningStep,
  Eyebrow,
  type EyebrowProps,
  CompassRosette,
  type CompassRosetteProps,
  ContourField,
  type ContourFieldProps,
  RouteLine,
  type RouteLineProps,
  Glyph,
  type GlyphProps,
  type GlyphName,
  StampSeal,
  type StampSealProps,
  SampleState,
  type SampleStateProps,
} from "./primitives";

// The engraved hero band (procedural skyline + flag chip + name)
export {
  EngravedHero,
  type EngravedHeroProps,
  type SkylineProfile,
} from "./EngravedHero";

// The engraved 8-metric scorecard
export {
  Scorecard,
  type ScorecardProps,
  type ScorecardMetric,
} from "./Scorecard";

// Setup + rules sections: the cost-and-rules stepper, the hiring read (with its
// days-to-hire dial), and the licence checklist.
export {
  SetupStepper,
  type SetupStepperProps,
  type SetupStep,
  DialGauge,
  type DialGaugeProps,
  HiringRead,
  type HiringReadProps,
  LicenceCheck,
  type LicenceCheckProps,
  type LicenceItem,
} from "./Setup";

// Comparison sections: the neighbours strip, the cities grid, the character
// panel, and vs-the-world.
export {
  Neighbours,
  type NeighboursProps,
  type NeighbourCountry,
  type NeighbourMetric,
  CitiesGrid,
  type CitiesGridProps,
  type CityCard,
  CharacterPanel,
  type CharacterPanelProps,
  type CharacterSpectrum,
  type CharacterStat,
  VsWorld,
  type VsWorldProps,
} from "./Compare";

// Editorial sections: what locals know, the honest take, the page-closing
// one-thing band, and the section divider family.
export {
  LocalsKnow,
  type LocalsKnowProps,
  type LocalInsight,
  HonestTake,
  type HonestTakeProps,
  OneThing,
  type OneThingProps,
  AtlasDivider,
  type AtlasDividerProps,
  type AtlasDividerVariant,
} from "./Editorial";

// The interactive gut-check triptych (a small client island for the toggles).
export { GutCheck, type GutCheckProps } from "./GutCheck";
