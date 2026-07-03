import * as React from "react";
import { SpineShell } from "@/components/spine/shell";

export default function SpineCellLayout({ children }: { children: React.ReactNode }) {
  return (
    <SpineShell bg="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=60" bgPosition="center 45%">
      {children}
    </SpineShell>
  );
}
