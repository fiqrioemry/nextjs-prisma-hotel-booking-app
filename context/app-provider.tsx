"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ThemeProvider
        enableSystem
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
      >
        <Toaster theme="dark" richColors />
        {children}
      </ThemeProvider>
    </div>
  );
}
