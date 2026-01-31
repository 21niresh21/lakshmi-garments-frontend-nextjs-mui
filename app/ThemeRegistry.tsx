"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeCustomizationProvider } from "./context/ThemeContext";
import CssBaseline from "@mui/material/CssBaseline";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeCustomizationProvider>
        <CssBaseline />
        {children}
      </ThemeCustomizationProvider>
    </AppRouterCacheProvider>
  );
}
