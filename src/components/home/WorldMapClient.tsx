"use client";

/**
 * Client wrapper that hands router.push to the WorldMapPicker.
 * Kept thin so the server component stays light.
 */
import { useRouter } from "next/navigation";
import WorldMapPicker from "@/components/WorldMapPicker";

export function WorldMapClient() {
  const router = useRouter();
  return (
    <WorldMapPicker
      onSelect={(iso2) => router.push(`/${iso2.toLowerCase()}`)}
    />
  );
}
