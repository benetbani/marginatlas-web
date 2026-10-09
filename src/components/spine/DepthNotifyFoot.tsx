/**
 * DepthNotifyFoot: the capture under the last band of a thin page, nothing elsewhere (milestone 1, M9). A thin page is one the
 * floor census counted under its floor outside the UK (src/lib/seo/depth_source.ts); the robots tag keeps it out of the index,
 * and keeps out pages that are not thin (depth_source.ts says which). The form names the page's place.
 */
import * as React from "react";
import { depthSourceFor, placeOfPath } from "@/lib/seo/depth_source";
import { DepthNotify } from "@/components/spine/interact/DepthNotify";
import { COPY } from "@/lib/spine/copy";

export function DepthNotifyFoot({ path }: { path: string }) {
  const source = depthSourceFor(path);
  const place = placeOfPath(path);
  if (!source || !place) return null;
  const W = COPY.depthNotify;
  return <DepthNotify source={source} words={{ ...W, label: W.label.replace("{place}", place) }} />;
}
