/**
 * The Atlas signature blocks (R6.5 Phase 1) - the brand-layer content-map
 * sections, ported from the 2026-06-14 Claude-design `sections/` set.
 *
 * These are the "Atlas way" recurring moves on top of the numbered data
 * sections: the operator voices, the honest risk read, the cost levers, the
 * licences checklist, the wage floor vs real pay, the street character, the
 * vs-the-world anchor, and the one-thing close. Each is tokens-only,
 * nullable-input, and carries an honest empty state (a calm "we are gathering /
 * not held yet" line) rather than self-omitting to nothing, so a page can keep
 * the slot as scaffolding and the grouped-empty collapse keeps thin pages calm.
 *
 * They never fabricate: a block with no real data shows its honest line. The
 * data that fills them lands in the data-fill phase; the architecture is here.
 */
export {
  OperatorVoices,
  type OperatorVoicesProps,
  type OperatorQuote,
} from "./OperatorVoices";
export {
  RiskList,
  type RiskListProps,
  type RiskItem,
  type RiskSeverity,
} from "./RiskList";
export {
  CostDrivers,
  type CostDriversProps,
  type CostDriver,
  type CostDriverDirection,
} from "./CostDrivers";
export {
  LicenceList,
  type LicenceListProps,
  type LicenceItem,
} from "./LicenceList";
export { MinimumWage, type MinimumWageProps } from "./MinimumWage";
export {
  StreetCharacter,
  type StreetCharacterProps,
  type StreetItem,
  type StreetTag,
} from "./StreetCharacter";
export { VsWorld, type VsWorldProps } from "./VsWorld";
export { OneThing, type OneThingProps } from "./OneThing";
