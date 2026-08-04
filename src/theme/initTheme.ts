export const THEME_STORAGE_KEY = "theme";

export type ThemeMode = "light" | "dark";

export function getSystemTheme(): ThemeMode {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function getStoredTheme(): ThemeMode | null {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return null;
}

export function resolveTheme(): ThemeMode {
  return getStoredTheme() ?? getSystemTheme();
}

export function applyTheme(theme: ThemeMode): void {
  document.documentElement.setAttribute("data-theme", theme);
}

/** Synchronous init — call before React render to avoid theme flash. */
export function initTheme(): ThemeMode {
  const theme = resolveTheme();
  applyTheme(theme);
  return theme;
}
