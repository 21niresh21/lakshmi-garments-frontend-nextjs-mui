"use client";

import * as React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useServerInsertedHTML } from "next/navigation";
import { ThemeCustomizationProvider } from "./context/ThemeContext";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ cache, flush }] = React.useState(() => {
    const cache = createCache({ key: "mui", prepend: true });
    cache.compat = true;

    let inserted: string[] = [];
    const originalInsert = cache.insert;

    cache.insert = (...args) => {
      const serialized = args[1];
      if (!inserted.includes(serialized.name)) {
        inserted.push(serialized.name);
      }
      return originalInsert(...args);
    };

    const flush = () => {
      const prev = inserted;
      inserted = [];
      return prev;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;

    return (
      <style
        data-emotion={`mui ${names.join(" ")}`}
        dangerouslySetInnerHTML={{
          __html: names.map((name) => cache.inserted[name]).join(""),
        }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeCustomizationProvider>
        <CssBaseline />
        {children}
      </ThemeCustomizationProvider>
    </CacheProvider>
  );
}
