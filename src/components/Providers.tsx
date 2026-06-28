"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { useEffect, useState } from "react";

import { ThemeRegistry } from "@/components/ThemeRegistry";
import { createQueryClient } from "@/lib/query-client";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  const [persister, setPersister] = useState<ReturnType<
    typeof createSyncStoragePersister
  > | null>(null);

  useEffect(() => {
    setPersister(
      createSyncStoragePersister({
        storage: window.localStorage,
        key: "rove-hire-query-cache",
      })
    );
  }, []);

  const content = !persister ? (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  ) : (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => query.state.status === "success",
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );

  return <ThemeRegistry>{content}</ThemeRegistry>;
}
