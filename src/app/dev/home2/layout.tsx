import * as React from "react";
import { SpineShell } from "@/components/spine/shell";

// Homepage motif , the shared skyline (same atmosphere as the country page); the masthead card floats over it.
export default function Home2Layout({ children }: { children: React.ReactNode }) {
  return (
    <SpineShell bg="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1920&q=60" bgPosition="center 16%">
      {children}
    </SpineShell>
  );
}
