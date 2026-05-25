import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const THEMES = {
  dark: {
    name: "Dark",
    label: "dark",
    icon: "moon",
    vars: {
      "--bg-base":       "#020617",   // slate-950
      "--bg-surface":    "#0f172a",   // slate-900
      "--bg-elevated":   "#1e293b",   // slate-800
      "--border-color":  "#1e293b",   // slate-800
      "--text-primary":  "#f1f5f9",   // slate-100
      "--text-secondary":"#94a3b8",   // slate-400
      "--text-muted":    "#475569",   // slate-600
      "--accent":        "#22d3ee",   // cyan-400
    }
  },
  oled: {
    name: "OLED",
    label: "oled",
    icon: "monitor",
    vars: {
      "--bg-base":       "#000000",
      "--bg-surface":    "#0a0a0a",
      "--bg-elevated":   "#111111",
      "--border-color":  "#1a1a1a",
      "--text-primary":  "#ffffff",
      "--text-secondary":"#8888aa",
      "--text-muted":    "#444455",
      "--accent":        "#00e5ff",
    }
  },
  light: {
    name: "Light",
    label: "light",
    icon: "sun",
    vars: {
      "--bg-base":       "#f8fafc",   // slate-50
      "--bg-surface":    "#ffffff",
      "--bg-elevated":   "#f1f5f9",   // slate-100
      "--border-color":  "#e2e8f0",   // slate-200
      "--text-primary":  "#0f172a",   // slate-900
      "--text-secondary":"#475569",   // slate-600
      "--text-muted":    "#94a3b8",   // slate-400
      "--accent":        "#0891b2",   // cyan-600
    }
  }
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("engblog_theme") || "dark";
  });

  useEffect(() => {
    const t = THEMES[theme] || THEMES.dark;
    const root = document.documentElement;

    // Apply CSS variables
    Object.entries(t.vars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });

    // Set data-theme attribute for CSS selectors
    root.setAttribute("data-theme", theme);
    document.body.className = theme === "light" ? "theme-light" : "";

    localStorage.setItem("engblog_theme", theme);
  }, [theme]);

  const cycleTheme = () => {
    const order = ["dark", "oled", "light"];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}
