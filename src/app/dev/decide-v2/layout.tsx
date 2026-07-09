import * as React from "react";
import { SpineShell } from "@/components/spine/shell";

// Reused street-level city motif for the recommender route (opacity-only, set in SpineShell).
export default function DecideV2Layout({ children }: { children: React.ReactNode }) {
  return (
    <SpineShell bg="https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=1920&q=60" bgPosition="center 30%">
      {children}
    </SpineShell>
  );
}
