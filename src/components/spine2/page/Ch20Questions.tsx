/**
 * Chapter 20 , questions people ask.
 *
 * Native details and summary, no client JavaScript. The two questions that
 * quote figures take them from the model, so the answers cannot go stale
 * against the page above them.
 */
import * as React from "react";

import { Qa } from "@/components/spine2/Qa";

export function Ch20Questions({
  questions,
}: {
  questions: Array<{ q: string; a: string }>;
}) {
  return <Qa className="rise" items={questions} />;
}
