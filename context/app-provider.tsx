"use client";

import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
  QueryClientProvider,
} from "@tanstack/react-query";
import React, { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider, useTheme } from "next-themes";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: 1,
          },
        },
      })
  );

  const { theme } = useTheme();
  const dehydratedState = dehydrate(queryClient);

  return (
    <ThemeProvider
      enableSystem
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
          <Toaster theme={theme as "light" | "dark" | "system"} richColors />
          {children}
        </HydrationBoundary>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
