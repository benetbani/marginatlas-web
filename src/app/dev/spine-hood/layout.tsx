import * as React from "react";
import { SpineShell } from "@/components/spine/shell";

export default function SpineHoodLayout({ children }: { children: React.ReactNode }) {
  return (
    <SpineShell bg="https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1920&q=60" bgPosition="center 40%">
      {children}
    </SpineShell>
  );
}
