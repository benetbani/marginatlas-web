import * as React from "react";
import { SpineShell } from "@/components/spine/shell";

// City motif , a street-level scene, opacity-only over white (distinct from the country skyline).
export default function SpineCityLayout({ children }: { children: React.ReactNode }) {
  return (
    <SpineShell bg="https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=1920&q=60" bgPosition="center 30%">
      {children}
    </SpineShell>
  );
}
