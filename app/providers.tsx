"use client";

import { EdgeStoreProvider } from "@/lib/edgestore-client";  // ← fix this line

export function Providers({ children }: { children: React.ReactNode }) {
  return <EdgeStoreProvider>{children}</EdgeStoreProvider>;
}