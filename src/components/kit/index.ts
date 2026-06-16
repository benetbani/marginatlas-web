/**
 * The Atlas Page Kit (design-system 12.2).
 *
 * The shared vocabulary every page composes from: answer-first masthead, the
 * honest-take through-line, the signature range strip, the per-$100 money
 * breakdown, the editorial beats, the structured data sections, the comparison
 * grammar, the sticky nav, and the closing furniture. Each is tokens-only,
 * nullable-input, self-omitting, plain-voiced. Pages import from here.
 */
export { RangeStrip, type RangeStripProps } from "./RangeStrip";
export { HonestTakeBox, type HonestTakeBoxProps } from "./HonestTakeBox";
export {
  AnswerFirstMasthead,
  type AnswerFirstMastheadProps,
  type MastheadAnchor,
  type MastheadSpread,
  type MastheadStat,
} from "./AnswerFirstMasthead";
export { CountUpNumber, type CountUpNumberProps } from "./CountUpNumber";
export { formatWithSpec, type NumberFormatSpec } from "./numberFormat";
export {
  MoneyGoesBreakdown,
  type MoneyGoesBreakdownProps,
  type MoneyGoesItem,
} from "./MoneyGoesBreakdown";

// Editorial beats
export {
  BeatCard,
  GutCheck,
  RealityCheck,
  RightForWrongFor,
  WhatLocalsKnow,
  ContrarianInsight,
  MythVsReality,
  type MythPair,
} from "./editorial";

// Structured data sections
export {
  PlainTerms,
  type PlainTermItem,
  BreakEvenLine,
  WagesByRole,
  type WageRole,
  Seasonality,
  RealisticFirstYear,
  SameBusinessNearby,
  type NearbyRow,
} from "./sections";

// Comparison grammar
export {
  LikeForLikeTable,
  type LikeForLikeColumn,
  type LikeForLikeRow,
  WageRangeTracks,
  type WageTrack,
} from "./comparison";

// Navigation + furniture
export { StickySectionNav, type NavSection } from "./StickySectionNav";
export { FreshnessStamp, FlagIt } from "./furniture";
export { SectionEmpty, type SectionEmptyProps } from "./SectionEmpty";
export { StillFillingIn, groupSectionStack, type StillFillingInSection } from "./StillFillingIn";

// Interaction controls — the reusable agency primitives (P1-P5) the switchers,
// the make-it-yours calculator, the watch/compare tray, and the zoom control all
// compose from. Controls act on the visible numbers in place, respond at the
// action's tempo, stay reversible with the canonical value beside any adjusted
// one, keep the reader oriented, and stay disclosed-not-displayed.
export { Slider, type SliderProps } from "./controls/Slider";
export { ResetAnchor, type ResetAnchorProps } from "./controls/ResetAnchor";
export { PendingShell, type PendingShellProps } from "./controls/PendingShell";
export {
  OrientationHeader,
  type OrientationHeaderProps,
  type OrientationItem,
} from "./controls/OrientationHeader";
export {
  Segmented,
  type SegmentedProps,
  type SegmentedOption,
} from "./controls/Segmented";

// Masthead switchers (sub-type reframes the page; venue re-expresses it) + the
// venue-context note slots. The page reads the same searchParams key server-side
// and re-derives; the switchers only write the key + expose the value.
export { SubTypeSwitcher, type SubTypeSwitcherProps, type SubTypeOption } from "./SubTypeSwitcher";
export { VenueSwitcher, type VenueSwitcherProps, type VenueOption } from "./VenueSwitcher";
export { CaptiveVenueNote, FreeZoneNote, type VenueNoteProps } from "./venue-notes";

// The make-it-yours what-if calculator (drives the RangeStrip "you" marker).
export { MakeItYours, type MakeItYoursProps, type MakeItYoursCanonical } from "./MakeItYours";

// The watch/compare tray + the add-to-watch affordance + the profile chip.
export { WatchTray, type WatchTrayProps, AddToWatch, type AddToWatchProps } from "./WatchTray";
export { ProfileChip, type ProfileChipProps } from "./ProfileChip";

// Zoom between altitudes (keeps the trade + place sticky, walks the resolution).
export { ZoomControl, type ZoomControlProps, type ZoomAltitude, type ZoomHrefs } from "./ZoomControl";

// The warm frame (R6 Phase B): the fixed place-photography gutters for the root
// layout + the per-category hero wash band behind a masthead. Flag-gated, no-op
// when off. Warmth lives in the frame; the data column stays cream and opaque.
export { AtlasGutters, HeroWash, type HeroWashProps, type HeroWashCategory } from "./frame";

// The six-band layout shell (Brand Design Constitution section 2): the band
// wrapper, the three reading lanes (12/6/4 grid), and the quiet sticky index.
// Pages compose these to read as a guided spread without changing section order.
export { Band, Lanes, SectionIndex, type IndexItem } from "./layout/bands";

// The Atlas signature blocks (R6.5 Phase 1): the brand-layer content-map
// sections (operator voices, risks, cost drivers, licences, wage floor vs real
// pay, street character, vs the world, the one-thing close). Nullable, honest
// empty state, tokens-only. Filled from data where held, scaffolding otherwise.
export {
  OperatorVoices,
  type OperatorVoicesProps,
  type OperatorQuote,
  RiskList,
  type RiskListProps,
  type RiskItem,
  type RiskSeverity,
  CostDrivers,
  type CostDriversProps,
  type CostDriver,
  type CostDriverDirection,
  LicenceList,
  type LicenceListProps,
  type LicenceItem,
  MinimumWage,
  type MinimumWageProps,
  StreetCharacter,
  type StreetCharacterProps,
  type StreetItem,
  type StreetTag,
  VsWorld,
  type VsWorldProps,
  OneThing,
  type OneThingProps,
} from "./blocks";

// The Atlas table family (R6.5, ported from the Claude-design table system): one
// grammar, single hairline + whitespace grouping, tabular figures, the 375px
// stacked reflow. LikeForLikeTable / WageRangeTracks (above) are unchanged.
export {
  AtlasTable,
  type AtlasTableProps,
  type AtlasColumn,
  type AtlasRow,
  ComparisonTable,
  type ComparisonTableProps,
  type ComparisonColumn,
  type ComparisonRow,
  OwnerKeepTable,
  type OwnerKeepTableProps,
  type OwnerKeepTrade,
  CostSplitTable,
  type CostSplitTableProps,
  type CostSplitRow,
  RangeTable,
  type RangeTableProps,
  type RangeTableRow,
  WeightedCompare,
  type WeightedCompareProps,
  type WeightedColumn,
  type WeightedMetric,
  // Shared table atom + its tone type, so a page can compose a one-off chip /
  // bar / range in the same grammar (the city page types its break-in chip tone
  // off ChipTone) without reaching past the barrel into ./tables/helpers.
  MeaningChip,
  type ChipTone,
} from "./tables";

// The Atlas chart family (R6.5, ported from the Claude-design charts): data-ink
// discipline, one warm ramp + the lone accent, each reduces to a legible 375px
// form. RangeStrip (the signature spread, above/at kit root) is reconciled in place.
export {
  Waterfall,
  type WaterfallProps,
  type WaterfallStep,
  ScoreBand,
  type ScoreBandProps,
  type ScoreBandStop,
  type ScoreTone,
  ComparisonBars,
  type ComparisonBarsProps,
  type ComparisonItem,
  HeatStrip,
  type HeatStripProps,
  type HeatCell,
  FootfallGrid,
  type FootfallGridProps,
  VisitorSplit,
  type VisitorSplitProps,
  // R7 graphical-reformation primitives (Phase 0)
  LikeForLikeBars,
  type LikeForLikeBarsProps,
  type LikeForLikeItem,
  ThresholdGauge,
  type ThresholdGaugeProps,
  TimelineRibbon,
  type TimelineRibbonProps,
  type TimelineMilestone,
  SeverityGlyph,
  type SeverityGlyphProps,
  type SeverityLevel,
  TierBar,
  type TierBarProps,
  type TierBarTone,
} from "./charts";

// The engraved-almanac foundation (2026-06-14, ported from the country-engraved
// design export): the cartographic primitives (compass rosette, contour field,
// surveyor route line, one-colour glyph set, council stamp seal), the quiet
// clay -> moss meaning scale, and the two flagship assets (the engraved hero
// band + the 8-metric scorecard). Tokens via the engraved CSS-var layer in
// globals.css, nullable inputs, honest sample states. A later wave composes the
// country page from these; this is the shared foundation only.
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
  EngravedHero,
  type EngravedHeroProps,
  type SkylineProfile,
  Scorecard,
  type ScorecardProps,
  type ScorecardMetric,
  // Wave-2 engraved section assets. Only the names that do NOT clash with the
  // earlier non-engraved kit blocks are re-exported here; the engraved VsWorld,
  // OneThing, GutCheck and HonestTake stay exclusive to "@/components/kit/
  // engraved" (the top barrel already exports the non-engraved VsWorld / OneThing
  // / GutCheck), so the country page imports the full engraved family from the
  // sub-barrel directly.
  SetupStepper,
  type SetupStepperProps,
  type SetupStep,
  DialGauge,
  type DialGaugeProps,
  HiringRead,
  type HiringReadProps,
  Neighbours,
  type NeighboursProps,
  type NeighbourCountry,
  type NeighbourMetric,
  // LicenceCheck only (NOT its LicenceItem type — the top barrel already exports
  // a LicenceItem from ./blocks; the engraved LicenceItem stays exclusive to the
  // "@/components/kit/engraved" sub-barrel to avoid a duplicate-identifier clash).
  LicenceCheck,
  type LicenceCheckProps,
  CitiesGrid,
  type CitiesGridProps,
  type CityCard,
  CharacterPanel,
  type CharacterPanelProps,
  type CharacterSpectrum,
  type CharacterStat,
  LocalsKnow,
  type LocalsKnowProps,
  type LocalInsight,
  AtlasDivider,
  type AtlasDividerProps,
  type AtlasDividerVariant,
} from "./engraved";
