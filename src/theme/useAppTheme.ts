import { useCallback, useEffect, useState } from "react";
import {
  applyTheme,
  getStoredTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
  type ThemeMode,
} from "./initTheme";

export function useAppTheme(): [ThemeMode, (theme: ThemeMode) => void, () => void] {
  const [theme, setThemeState] = useState<ThemeMode>(() => resolveTheme());
  const [explicitPreference, setExplicitPreference] = useState(
    () => getStoredTheme() !== null,
  );

  useEffect(() => {
    applyTheme(theme);
    if (explicitPreference) {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme, explicitPreference]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (explicitPreference) return;
      const next: ThemeMode = media.matches ? "dark" : "light";
      setThemeState(next);
      applyTheme(next);
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [explicitPreference]);

  const setTheme = useCallback((next: ThemeMode) => {
    setExplicitPreference(true);
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setExplicitPreference(true);
    setThemeState((current) => (current === "light" ? "dark" : "light"));
  }, []);

  return [theme, setTheme, toggleTheme];
}

export type { ThemeMode };
