"use client";

import { EdgeStoreProvider } from "@/lib/edgestore-client";

export function Providers({ children }: { children: React.ReactNode }) {
  return <EdgeStoreProvider>{children}</EdgeStoreProvider>;
}
