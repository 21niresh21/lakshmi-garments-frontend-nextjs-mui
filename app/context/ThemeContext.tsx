"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getThemeOptions } from "@/app/themes/theme";

export type ThemeConfiguration = {
  primaryMain: string;
  primaryLight: string;
  primaryDark: string;
  secondaryMain: string;
  borderRadius: number;
  mode: "light" | "dark";
  fontSize: number;
  fontWeight: number;
  fontFamily: string;
  compactMode: boolean;
  themeStyle: "standard" | "glass" | "flat" | "frosted";
};

type ThemeContextType = {
  config: ThemeConfiguration;
  updateConfig: (newConfig: Partial<ThemeConfiguration>) => void;
  resetConfig: () => void;
  toggleMode: () => void;
  setThemeStyle: (style: ThemeConfiguration["themeStyle"]) => void;
};

export const defaultConfig: ThemeConfiguration = {
  primaryMain: "#6f41a8ff",
  primaryLight: "#9B7EBD",
  primaryDark: "#4e2a7bff",
  secondaryMain: "#3F4C6B",
  borderRadius: 4,
  mode: "light",
  fontSize: 14,
  fontWeight: 400,
  fontFamily: "'Inter', 'Roboto', sans-serif",
  compactMode: false,
  themeStyle: "standard",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeCustomizationProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ThemeConfiguration>(defaultConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem("customThemeConfig");
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        // Merge with defaults to handle partial or outdated configs
        setConfig((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse saved config", e);
      }
    }
    setIsLoaded(true);
  }, []);
  
  const updateConfig = (newConfig: Partial<ThemeConfiguration>) => {
    setConfig((prev) => {
      const merged = { ...prev, ...newConfig };
      localStorage.setItem("customThemeConfig", JSON.stringify(merged));
      return merged;
    });
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    localStorage.removeItem("customThemeConfig");
  };

  const toggleMode = () => {
    updateConfig({ ...config, mode: config.mode === "light" ? "dark" : "light" });
  };

  const setThemeStyle = (themeStyle: ThemeConfiguration["themeStyle"]) => {
    updateConfig({ ...config, themeStyle });
  };

  const activeTheme = useMemo(() => {
    return createTheme(getThemeOptions(config));
  }, [config]);

  if (!isLoaded) return null; // Prevent flash of default theme

  return (
    <ThemeContext.Provider value={{ config, updateConfig, resetConfig, toggleMode, setThemeStyle }}>
      <ThemeProvider theme={activeTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useCustomTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useCustomTheme must be used within a ThemeCustomizationProvider");
  }
  return context;
}
