"use client";

import { useCallback, useEffect, useState } from "react";
import { ThemeMode } from "@/data/types";

const THEME_KEY = "rbdts_theme";

function readInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem(THEME_KEY) as ThemeMode | null) ?? "dark";
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(readInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
