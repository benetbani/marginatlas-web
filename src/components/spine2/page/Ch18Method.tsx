/**
 * Chapter 18 , how we work this out.
 *
 * Method asserts its own arithmetic at render: start plus the subs must equal
 * the stated result, or it throws in dev. The five lines here are the file's
 * own figures, and they close to the cent, which is the point of putting them
 * on the page at all.
 *
 * The ledger is the source of the trust strip's tally, so the counts in the
 * hero and the footer can never drift from the rows a reader can see.
 */
import * as React from "react";

import { Method } from "@/components/spine2/Method";
import { TierDefinitions } from "@/components/spine2/TierPill";
import type { MethodModel } from "@/lib/cells/spine2_adapter";

export function Ch18Method({ method }: { method: MethodModel }) {
  return (
    <>
      <Method
        className="rise"
        arithmetic={method.arithmetic}
        ledger={method.ledger}
        footnote="Every figure on this page is built from those five lines. Change one in the calculator and the whole page follows."
      />
      <TierDefinitions style={{ marginTop: 14, maxWidth: "78ch" }} />
    </>
  );
}
