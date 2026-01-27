"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { createCustomTheme } from "@/app/themes/theme";

export type ThemeConfiguration = {
  primaryMain: string;
  primaryLight: string;
  primaryDark: string;
  secondaryMain: string;
  borderRadius: number;
  mode: "light" | "dark";
  fontSize: number;
  fontFamily: string;
  compactMode: boolean;
};

type ThemeContextType = {
  config: ThemeConfiguration;
  updateConfig: (newConfig: ThemeConfiguration) => void;
  resetConfig: () => void;
};

export const defaultConfig: ThemeConfiguration = {
  primaryMain: "#6f41a8ff",
  primaryLight: "#9B7EBD",
  primaryDark: "#4e2a7bff",
  secondaryMain: "#3F4C6B",
  borderRadius: 4,
  mode: "light",
  fontSize: 14,
  fontFamily: "'Inter', 'Roboto', sans-serif",
  compactMode: false,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeCustomizationProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ThemeConfiguration>(defaultConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem("customThemeConfig");
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error("Failed to parse saved config", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const updateConfig = (newConfig: ThemeConfiguration) => {
    setConfig(newConfig);
    localStorage.setItem("customThemeConfig", JSON.stringify(newConfig));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    localStorage.removeItem("customThemeConfig");
  };

  const activeTheme = useMemo(() => {
    return createCustomTheme(config);
  }, [config]);

  if (!isLoaded) return null; // Prevent flash of default theme

  return (
    <ThemeContext.Provider value={{ config, updateConfig, resetConfig }}>
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
