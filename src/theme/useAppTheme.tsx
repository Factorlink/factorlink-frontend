import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyTheme,
  getStoredTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
  type ThemeMode,
} from "./initTheme";

interface AppThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
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

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>
  );
}

export function useAppTheme(): AppThemeContextValue {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within AppThemeProvider");
  }
  return context;
}

export type { ThemeMode };
