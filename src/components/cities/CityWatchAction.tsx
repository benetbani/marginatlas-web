"use client";

/**
 * CityWatchAction - the masthead "keep this city" affordance.
 *
 * A thin client island wrapping the kit AddToWatch so the server-rendered city
 * page can drop a single "Watch" button in its masthead action area without
 * itself becoming a client component. The reader flags the whole city (the
 * broad place coordinate) to come back to; the floating WatchTray and /you read
 * the same durable list.
 *
 * The page passes the already-built WatchInput (kind "city"), so all the item
 * shape lives at the call site where the city figures are in scope. This file is
 * the only "use client" seam: tokens only, no raw hex / px / ms, no em-dashes,
 * no source-agency names.
 */
import * as React from "react";
import { AddToWatch } from "@/components/kit";
import type { WatchInput } from "@/lib/watch_store";

export type CityWatchActionProps = {
  /** The city watch item (kind "city"), built by the page. */
  item: WatchInput;
  className?: string;
};

export function CityWatchAction({ item, className }: CityWatchActionProps) {
  return <AddToWatch item={item} variant="button" className={className} />;
}
