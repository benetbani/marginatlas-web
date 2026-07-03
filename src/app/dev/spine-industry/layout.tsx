import * as React from "react";
import { SpineShell } from "@/components/spine/shell";

export default function SpineIndustryLayout({ children }: { children: React.ReactNode }) {
  return (
    <SpineShell bg="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1920&q=60" bgPosition="center 50%">
      {children}
    </SpineShell>
  );
}
